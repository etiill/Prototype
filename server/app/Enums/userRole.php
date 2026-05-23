<?php

namespace App\Enums;

enum userRole: string
{
    case SYSTEM_ADMIN = 'system_admin';
    case TEACHER = 'teacher';
    case PARENT = 'parent';
}
