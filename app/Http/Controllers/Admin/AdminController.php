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

    $id = \Auth::user()->id;

    $admin = \App\Admin::select('active')->where('user_id', $id)->first();

    if ($admin['active'] == 1)
    {
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

  public function update(){


  }
}
