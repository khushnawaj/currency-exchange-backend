import django
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static  

def home(request):
    return JsonResponse({
        "message": "Currency Exchange API is running 🚀"
    })


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('wallet.urls')),
    path('api/', include('currency.urls')),
    path('api/', include('transactions.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

