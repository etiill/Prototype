<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SystemAdministrator;
use App\Enums\userRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SystemAdministratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'System Administrator',
            'username' => 'sysadmin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => userRole::SYSTEM_ADMIN->value,
        ]);

        SystemAdministrator::create([
            'user_id' => $user->id,
        ]);
    }
}
