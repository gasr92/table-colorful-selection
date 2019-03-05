var AuxCounter = 0;
function TableColorfulRowSelection(opt){

    /**
     * Opt
     * 
     * table_id : String
     * tr_background_color_when_selected : String
     * tr_font_color_when_selected : String
     * only_select_when_ctrl_is_pressed : Boolean
     * event_name_selected_row : String
     */
    
    if(!ValidateArgs(arguments, opt))
        return;

    var self = this;
    var _tableId = opt.table_id;
    var _trBackgroundColor = Nvl(opt.tr_background_color_when_selected, 'linear-gradient(to right,#0597b6,#37d3f5)');
    var _trFontColor = Nvl(opt.tr_font_color_when_selected, '#fff');
    var _applyOnlyWithCtrl = Nvl(opt.only_select_when_ctrl_is_pressed, false);
    var _eventNameSelectedRow = 'EvSelectedRow';
    var _selectedTrClass_ = 'tr-colorful-selection-selected-' + AuxCounter++;
    const _attrDataTrValue_ = 'data-tr-value';
    this.selectedValues = [];

    CreateStyle();

    $(document).ready(function(e){
        $('#' + _tableId + ' tbody tr').on('click', function(e){

            var tr = this;
            var ctrlIsPressed = e.ctrlKey;

            if((ctrlIsPressed && _applyOnlyWithCtrl) || !_applyOnlyWithCtrl){

                var hasDataValueSet = (typeof $(tr).attr(_attrDataTrValue_) !== 'undefined');
                var blnSelected = StylizeRow(tr);
               
                if(hasDataValueSet)
                    FireEvent(tr, blnSelected);
            }
        });
    });

    function FireEvent(p_tr, p_selected){
        var valueData = $(p_tr).attr(_attrDataTrValue_);
        var dataDetail = {
            'detail': {
                'val' : valueData,
                'selected' : p_selected,
                'table_id' : _tableId
            }
        };

        var EvToggleSelectetdTableRow = new CustomEvent(_eventNameSelectedRow, dataDetail);

        dispatchEvent(EvToggleSelectetdTableRow);
        window.removeEventListener(_eventNameSelectedRow, EvToggleSelectetdTableRow, false);

        EvToggleSelectetdTableRow = null;

        if(p_selected){
            self.selectedValues.push(valueData);
        }
        else{            
            $.each(self.selectedValues, function(i, element){

                if(valueData === element)
                   self.selectedValues.splice(i, 1);

            });
        }
    }

    function CreateStyle(){ 
        var vCss = '.' + _selectedTrClass_ + ' { '+ 
        '    background: ' + _trBackgroundColor + ';' +
        '    color: ' + _trFontColor + ';' +
        '}';

        var pStyle = document.createElement('style');
        pStyle.type = 'text/css';
        pStyle.innerHTML = vCss;

        document.getElementsByTagName('head')[0].appendChild(pStyle);
    }

    function IsStylizedClass(p_tr){
        if($(p_tr).hasClass(_selectedTrClass_))
            return true;
        else
            return false;
    }

    function StylizeRow(p_tr){
        if(IsStylizedClass(p_tr)){
            $(p_tr).removeClass(_selectedTrClass_);
            return false;
        }
        else{
            $(p_tr).addClass(_selectedTrClass_);
            return true;
        }
    }

    function Nvl(p_1, p_2){
        if(typeof p_1 === 'undefined' || p_1 === null || p_1 === '')
            return p_2;

        return p_1;
    }

    function ValidateArgs(arguments, opt){
        if(arguments.length === 0){
            console.error('-> No parameter informed to TableColorfulSelection.');
            return false;
        }
    
        if(!('table_id' in opt))    {
            console.error('-> Not informed table id to TableColorfulSelection, you must inform it.');
            return false;
        }

        return true;
    }
};

 TableColorfulRowSelection.prototype = () => this.selectedValues;