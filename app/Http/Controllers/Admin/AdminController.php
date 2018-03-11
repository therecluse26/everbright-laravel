<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Http\Controllers\UserInfoController;

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

    if ( \Auth::user()->isAdmin() )
    {
      return view('admin/admin');

    } else {
      //Sends user home if not admin
      return redirect('/');

    }
  }

  public function userIndex () {

    //if ( \Auth::user()->isAdmin() ){
      // List all users
      $users = \App\User::all();

      $roles = \App\Role::all();

      //return $users;

      return view('admin/admin_user_index', ['users'=>$users, 'roles'=>$roles]);

    //}


  }
  public function edit()
  {
    $user = UserInfoController::pullCurrentUser();

    return view('admin/adminedit', ['user'=>$user]);

  }

  public function update(){


  }
}
