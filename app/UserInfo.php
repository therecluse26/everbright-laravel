<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
  protected $fillable = [
      'billing_street', 'billing_street2', 'billing_city',
      'billing_state', 'billing_zip', 'shipping_street', 'shipping_street2',
      'shipping_city', 'shipping_state', 'shipping_zip', 'same_ship_bill'
  ];
  protected $casts = [ 'same_ship_bill' => 'boolean' ];
}
