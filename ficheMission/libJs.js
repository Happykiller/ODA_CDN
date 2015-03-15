//# sourceURL=libJs.js
//Library of tools for process fiche mission

/**
 * @author FRO
 * @date 11/02/2015
 */

(function () {
    'use strict';

    var
        _input = input,
        _output = output,
        _lang = 'fr',
        _datas = {}
    ;
    
    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * @name _init
     * @desc Initialize
     */
    function _init() {
        $.ajax({
            type : "Get",
            url :_input.rest+"datas.json",
            data : null,
            dataType :"jsonp",
            jsonp: false,
            jsonpCallback: "myJsonMethod",
            success : function(data){
                _datas = data; 
                $.functionsApp.init();
            },
            error : function(httpReq,status,exception){
                var err = status + ", " + exception;
                console.log( "Request Failed: " + err );
            }
        });
    }
    
    /**
     * @name _init
     * @desc Initialize
     */
    function _getTLabels(p_params) {
        try {
            return _datas.i8n[p_params.page][p_params.lang];
        } catch (er) {
            console.log(0, "ERROR - _getTLabels :" + er.message);
        }
    }

    ////////////////////////// PUBLIC METHODS /////////////////////////

    $.functionsApp = {
        init : function () {
            try {
                _lang = _input.langLocal;
                $('#content').html('');
                $.functionsApp.buildFlags();
                $.functionsApp.changeLang({'lang':_lang});
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.init :" + er.message);
            }
        }
        , buildFlags : function(){
            try {
                var strHtml = "";
				
                strHtml += '<img src="'+_input.rest+'img/france.png" alt="Fran&ccedil;ais" height="42" width="42" onclick="$.functionsApp.changeLang({\'lang\':\'fr\'});">';
                strHtml += '&nbsp;&nbsp;&nbsp;<img src="'+_input.rest+'img/angleterre.png" alt="English" height="42" width="42" onclick="$.functionsApp.changeLang({\'lang\':\'en\'});">';
				
                $('#content').html(strHtml);
            } catch (er) {
                console.log(0, "ERROR - buildFlags :" + er.message);
            }
        }
        , changeLang : function(p_params){
            try {
                _lang = p_params.lang;
                
                var datasLabel = _getTLabels({'lang':_lang, 'page':_input.page});
                
                for(var indice in _datas.pageDesc[_input.page]){
                    var elt = _datas.pageDesc[_input.page][indice];
                    
                    switch(elt.type) {
                        case "button":
                            $(elt.type+'#'+elt.id).text(datasLabel[elt.id]);
                            break;
                        default:
                            $('[id="'+elt.id+'"]').html(datasLabel[elt.id]);
                    }
                }
            } catch (er) {
                console.log(0, "ERROR - changeLang :" + er.message);
            }
        }
    };

    // Initialize
    _init();

})();