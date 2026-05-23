<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SystemAdministratorSeeder::class,
        ]);

        // Teacher User
        User::factory()->create([
            'name' => 'Jane Doe',
            'username' => 'teacher',
            'email' => 'teacher@prototype.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        // Parent User
        User::factory()->create([
            'name' => 'John Parent',
            'username' => 'parent',
            'email' => 'parent@prototype.com',
            'password' => bcrypt('password'),
            'role' => 'parent',
        ]);
    }
}
