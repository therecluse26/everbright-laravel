<div class="subject-info-box-1">
  <h4>Available</h4>
  <select multiple="multiple" id='roles-available' class="form-control">
    @foreach ( $roles as $role )
      <option value="{{ $role->name }}">{{ $role->name }}</option>
    @endforeach
  </select>
</div>

<div class="subject-info-arrows text-center">
  <input type="button" id="btnAllRight" value=">>" class="btn btn-default" /><br />
  <input type="button" id="btnRight" value=">" class="btn btn-default" /><br />
  <input type="button" id="btnLeft" value="<" class="btn btn-default" /><br />
  <input type="button" id="btnAllLeft" value="<<" class="btn btn-default" />
</div>

<div class="subject-info-box-2">
  <h4>Selected</h4>
  <select multiple="multiple" id='roles-selected' class="form-control">
  </select>
</div>
