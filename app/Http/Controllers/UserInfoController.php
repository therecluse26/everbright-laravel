<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class UserInfoController extends Controller
{
    public static function pullCurrentUser()
    {
        $id = \Auth::user()->id;
        $user = User::with(['userinfo', 'author'])->where('id', $id)->first();

        return $user;
    }

    public function show($id)
    {
        $user = User::with(['userinfo', 'author'])->where('id', $id)->first();
        return view('user/user_show', ['user' => $user]);
    }

    //Pull form for editing
    public function edit()
    {
        $user = UserInfoController::pullCurrentUser();

        if (\Auth::user()->isAdmin()) {
            return view('admin/admin_edit', ['user'=>$user]);
        } else {
            return view('user/user_edit', ['user'=>$user]);
        }
    }

    //Update user data
    public function update()
    {
        try {
            $id = \Auth::user()->id;
            $input = Request::all();
            $user = \App\User::find($id);

            //return $input;

            $userinfo_array = [];

            //Loops through set user values and inserts them as properties to update
            //Excludes related arrays (handled later)
            foreach ($input as $key => $value) {
                if (!is_array($value) && $key != '_token' && $key != 'same_ship_bill') {
                    $user->$key = isset($input[$key]) ? $value : null;
                }
            }

            $user['email_notifications'] = (array_key_exists('email_notifications', $input)) ? 1 : 0;
            $user['text_notifications'] = (array_key_exists('text_notifications', $input)) ? 1 : 0;

            $user->save();

            //Update UserInfo if UserInfo record exists
            if (array_key_exists('userinfo', $input)) {
                //Loops through set userinfo values and inserts them into array to update
                foreach ($input['userinfo'] as $key => $value) {
                    $userinfo_array[$key] = isset($input['userinfo'][$key]) ? $value : null;
                }

                $userinfo_array['same_ship_bill'] = (array_key_exists('same_ship_bill', $input)) ? 1 : 0;

                //If "Shipping Same As Billing" is checked
                if ($userinfo_array['same_ship_bill'] == 1) {
                    $userinfo_array['shipping_street'] = $userinfo_array['billing_street'];
                    $userinfo_array['shipping_street2'] = $userinfo_array['billing_street2'];
                    $userinfo_array['shipping_city'] = $userinfo_array['billing_city'];
                    $userinfo_array['shipping_state'] = $userinfo_array['billing_state'];
                    $userinfo_array['shipping_zip'] = $userinfo_array['billing_zip'];
                }

                //Push UserInfo changes
                $user->UserInfo->update($userinfo_array);
            }

            //Update Admin info if admin record exists
            if (array_key_exists('admin', $input)) {
                //Loops through set admin values and inserts them into array to update
                foreach ($input['admin'] as $key => $value) {
                    $admin[$key] = isset($input['admin'][$key]) ? $value : null;
                }

                //Push Admin changes
                $user->Admin->update($admin);
            }

            //Update Author info if author record exists
            if (array_key_exists('author', $input)) {
                //Loops through set author values and inserts them into array to update
                foreach ($input['author'] as $key => $value) {
                    $author[$key] = isset($input['author'][$key]) ? $value : null;
                }

                //Push Author changes
                $user->Author->update($author);
            }

            //Returns success
            return array('status'=>'success', 'msg'=>'User info updated successfully!');
        } catch (\Exception $e) {
            return array('status'=>'error', 'msg'=>'Error: ' . $e->getMessage());
        }
    }
}
