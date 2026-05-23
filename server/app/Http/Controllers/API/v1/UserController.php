<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use App\Models\ParentProfile;
use App\Models\SystemAdministrator;
use App\Enums\userRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::where('id', '!=', auth()->id())->get();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Support 'full_name' from frontend
        if ($request->has('full_name')) {
            $request->merge(['name' => $request->full_name]);
        }

        // Normalize role to lowercase for validation
        if ($request->has('role')) {
            $request->merge(['role' => strtolower($request->role)]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:system_admin,teacher,parent',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'username' => $request->username,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => $request->role,
                ]);

                // Create profile based on role
                switch ($request->role) {
                    case userRole::TEACHER->value:
                        Teacher::create(['user_id' => $user->id]);
                        break;
                    case userRole::PARENT->value:
                        ParentProfile::create(['user_id' => $user->id]);
                        break;
                    case userRole::SYSTEM_ADMIN->value:
                        SystemAdministrator::create(['user_id' => $user->id]);
                        break;
                }

                return response()->json([
                    'message' => 'User created successfully',
                    'user' => $user
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Support 'full_name' from frontend
        if ($request->has('full_name')) {
            $request->merge(['name' => $request->full_name]);
        }

        // Normalize role to lowercase
        if ($request->has('role')) {
            $request->merge(['role' => strtolower($request->role)]);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|string|in:system_admin,teacher,parent',
        ]);

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->update($request->only(['name', 'username', 'email', 'role']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
