from django.db import models
from django.contrib.auth import get_user_model

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='created_%(class)s',null=True, blank=True ,editable=False)
    updated_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='updated_%(class)s', null=True, blank=True ,editable=False)


    class Meta:
        abstract = True