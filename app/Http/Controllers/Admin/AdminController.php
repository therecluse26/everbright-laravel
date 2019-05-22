<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Http\Controllers\UserInfoController;
use \App\User;
use \App\Role;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (\Auth::user()->isAdmin()) {
            return view('admin/admin');
        } else {
            //Sends user home if not admin
            return redirect('/');
        }
    }

    public function edit()
    {
        $user = UserInfoController::pullCurrentUser();

        return view('admin/adminedit', ['user'=>$user]);
    }

    public function update()
    {
    }
}
