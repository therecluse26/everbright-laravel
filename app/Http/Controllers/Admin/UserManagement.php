<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \App\User;
use \App\Role;

class UserManagement extends Controller
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
     * Show admin page for user management
     *
     * @return \Illuminate\Http\Response
     */
    public function userIndex()
    {
        $users = User::all();
        $roles = Role::pluck('id', 'name');

        return view('admin/admin_user_index', ['users'=>$users, 'roles'=>json_encode($roles, JSON_UNESCAPED_SLASHES) ]);
    }


    /**
     * Lists roles for each user
     *
     * @return \Illuminate\Http\Response
     */
    public function userRolesList($id)
    {
        $comboArray = [];
        $comboArray['all_roles'] = $comboArray['user_roles'] = $comboArray['diff_roles'] = [];

        $user = User::find($id);
        $roles = Role::pluck('roles.name', 'roles.id');
        $userRoles = $user->roles()->pluck('roles.name', 'roles.id');

        foreach ($roles as $roleId => $role) {
            array_push($comboArray['all_roles'], array( 'id'=>$roleId, 'name'=>$role ));
            array_push($comboArray['diff_roles'], array( 'id'=>$roleId, 'name'=>$role ));
        }

        foreach ($userRoles as $userRoleId => $userRole) {
            array_push($comboArray['user_roles'], array( 'id'=>$userRoleId, 'name'=>$userRole));
        }

        foreach ($comboArray['user_roles'] as $userRole) {
            if (($roleKey = array_search($userRole['name'], array_column($comboArray['all_roles'], 'name'))) !== false) {
                unset($comboArray['diff_roles'][$roleKey]);
            }
        }

        $comboArray['diff_roles'] = array_values($comboArray['diff_roles']);

        return ($comboArray);
    }



    public function userRolesUpdate(Request $request)
    {
        try {
            $roles = json_decode($request->get('formData'));
            $userId = json_decode($request->get('userId'));

            \DB::table('user_roles')->where('user_id', '=', $userId)->delete();

            foreach ($roles[0] as $role) {
                \DB::table('user_roles')->insert(
                    ['user_id' => $userId, 'role_id' => $role->role_id]
                );
            }

            return $roles;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function userDelete(Request $request)
    {
        $response = [];

        try {
            $userId = $request->get('id');

            $user = User::where('id', $userId)->first();

            if ($user->author()) {
                $user->author()->delete();
            }

            if ($user->userInfo()) {
                $user->userInfo()->delete();
            }

            \DB::table('user_roles')->where('user_id', '=', $userId)->delete();
            $user->delete();

            //  \DB::table('user_roles')->where('user_id', '=', $userId)->delete();
            //\DB::table('authors')->


            $response['status'] = 'success';

            return $response;
        } catch (Exception $e) {
            $response['status'] = $e->getMessage();

            return $response;
        }
    }
}
