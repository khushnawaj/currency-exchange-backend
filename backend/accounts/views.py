from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, SignupSerializer, ProfilePhotoSerializer, UserSerializer
from .models import FavoriteCurrency


# -------------------------
# LOGIN API
# -------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(
        data=request.data,
        context={"request": request}
    )

    if serializer.is_valid():
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "email": user.email,
                "full_name": user.full_name
            }
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# SIGNUP API
# -------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Signup successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "email": user.email,
                "full_name": user.full_name
            }
        }, status=status.HTTP_201_CREATED)
    

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    user = request.user
    serializer = ProfilePhotoSerializer(
        user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Profile photo updated",
            "profile_photo": request.build_absolute_uri(
                user.profile_photo.url
            )
        })


    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = request.user

    if request.method == "GET":
        serializer = UserSerializer(user, context={"request": request})
        return Response(serializer.data)

    if request.method == "PATCH":
        serializer = UserSerializer(user, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated",
                "user": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def favorite_currencies(request):
    user = request.user

    if request.method == "GET":
        favorites = FavoriteCurrency.objects.filter(user=user).values_list('currency_code', flat=True)
        return Response(list(favorites))

    if request.method == "POST":
        currency_code = request.data.get('currency_code')
        if not currency_code:
            return Response({"error": "Currency code required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite, created = FavoriteCurrency.objects.get_or_create(
            user=user,
            currency_code=currency_code.upper()
        )
        if not created:
            return Response({"error": "Already favorite"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Added to favorites"})

    if request.method == "DELETE":
        currency_code = request.data.get('currency_code')
        if not currency_code:
            return Response({"error": "Currency code required"}, status=status.HTTP_400_BAD_REQUEST)

        FavoriteCurrency.objects.filter(user=user, currency_code=currency_code.upper()).delete()
        return Response({"message": "Removed from favorites"})
