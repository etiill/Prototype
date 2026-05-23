<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AuthenticationLog;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * Display a listing of authentication logs.
     */
    public function index()
    {
        $logs = AuthenticationLog::with('user')
            ->latest()
            ->get();

        return response()->json($logs);
    }
}
