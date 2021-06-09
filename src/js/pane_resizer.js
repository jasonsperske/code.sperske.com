class PaneResizer {
  constructor(handle_element, input_value_fn, output_value_fn) {
    this._handle_element = handle_element;
    this._input_value_fn = input_value_fn;
    this._output_value_fn = output_value_fn;

    this._handle_element.onmousedown = () => {
      this._resizer_instance = this._resizer.bind(this);
      this._resizer_end_instance = this._resizer_end.bind(this);
      this._disable_selection_instance = this._disable_selection.bind(this);

      window.addEventListener('mousemove', this._resizer_instance);
      window.addEventListener('mouseup', this._resizer_end_instance);
      window.addEventListener('selectstart', this._disable_selection_instance);
    };
  }

  _disable_selection(e) {
    e.preventDefault();
  }

  _resizer(e) {
    this._output_value_fn(this._input_value_fn(e));
  }

  _resizer_end() {
    window.removeEventListener('mousemove', this._resizer_instance);
    window.removeEventListener('mouseup', this._resizer_instance);
    window.removeEventListener('selectstart', this._disable_selection_instance);
  }
}
