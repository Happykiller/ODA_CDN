//# sourceURL=libActivity.js
//Library of tools for the exemple

/**
 * @author FRO
 * @date 11/02/2015
 */

(function () {
    'use strict';

    var
        _input = input,
        _output = output,
        _debug = input.debug,
        _clientId = input.clientId,
        _apiKey = input.apiKey,
        _scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    ;
    
    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * @name _init
     * @desc Initialize
     */
    function _init() {
        $.functionsApp.init();
    }

    ////////////////////////// PUBLIC METHODS /////////////////////////

    $.functionsApp = {
        init : function () {
            try {
                $('#content').html('Hello');
                $.getScript("https://apis.google.com/js/client.js?onload=handleClientLoad",$.functionsApp.handleClientLoad);
                console.log("$.functionsApp.init finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.init :" + er.message);
            }
        },
        handleClientLoad : function() {
            try {
                if(null == gapi.client) {
                    window.setTimeout($.functionsApp.handleClientLoad,1000);
                    return;
                }
                $.functionsApp.loadGapis([{"api":"oauth2","version":"v2"},{"api":"calendar","version":"v3"}], $.functionsApp.callbackLaodGapis);
                console.log("$.functionsApp.handleClientLoad finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.handleClientLoad :" + er.message);
            }
        },
        loadGapis : function(tabApi, callbackFunction) {
            try {
                if(tabApi.length>0){
                    gapi.client.load(tabApi[0].api, tabApi[0].version,function(resp){
                        if(typeof resp == "undefined"){
                            console.log('Chargement ok pour : '+tabApi[0].api + " en "+tabApi[0].version);
                            tabApi.splice(0,1);
                            $.functionsApp.loadGapis(tabApi,callbackFunction);
                        }else{
                            console.log('Chargement ko pour : '+tabApi[0].api + " en "+tabApi[0].version + "("+resp.error.message+")");
                        }
                    });
                }else{
                    callbackFunction();
                }
                console.log("$.functionsApp.loadGapis finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.loadGapis :" + er.message);
            }
        },
        callbackLaodGapis : function(){
            try {
                gapi.client.setApiKey(_apiKey);
                gapi.auth.authorize({client_id: _clientId, scope: _scopes, immediate: true}, $.functionsApp.handleAuthResult);
                console.log("$.functionsApp.callbackLaodGapis finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.callbackLaodGapis :" + er.message);
            }
        },
        handleAuthResult : function(authResult) {
            try {
                if ((authResult) && (!authResult.error) && (authResult.access_token != undefined)) {
                    $('#content').html('<div id="divUser"></div><div id="divAction"></div><div id="divMsg"></div>');
                    $.functionsApp.startApp();
                } else {
                    $('#content').html('<button id="authorize-button" onclick="$.functionsApp.handleAuthClick();">Authorize</button>');
                }
                console.log("$.functionsApp.handleAuthResult finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.handleAuthResult :" + er.message);
            }
        },
        handleAuthClick : function(event) {
            try {
                gapi.auth.authorize({client_id: _clientId, scope: _scopes, immediate: false}, $.functionsApp.handleAuthResult);
                console.log("$.functionsApp.handleAuthClick finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.handleAuthClick :" + er.message);
            }
        },
        startApp : function() {
            try{
                gapi.client.oauth2.userinfo.get().execute(function(resp) {
                    $('#divUser').html("<b>Current user : </b>"+resp.email);
                    if(resp.email.search("@bonitasoft.com") != -1){
                        $('#divAction').html('<button onclick="$.functionsApp.createAppointment();" class="bonita_form_button">Create Appointment</button>');
                    }else{
                        $('#divAction').html('<b>Warning : </b>Please change the current user for an account @bonitasoft.com who can write in calendar : service.');
                    }
                });
                console.log("$.functionsApp.startApp finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.startApp :" + er.message);
            }
        },
        getDateGoole : function(p_date) {
            try{
                //13-03-15 13:00
                //2015-03-01T10:00:00.000+01:00
                var array0 = p_date.split(" ");
                var arrayDate = array0[0].split("-");
                var strDateGoole = "20"+arrayDate[2]+"-"+arrayDate[1]+"-"+arrayDate[0]+"T"+array0[1]+":00.000+01:00";
                console.log("$.functionsApp.getDateGoole finish.");
                return strDateGoole;
            } catch (er) {
                return null;
                console.log(0, "ERROR - $.functionsApp.getDateGoole :" + er.message);
            }
        },
        createAppointment : function(){
            try{
                var input_type        = $('#input_type select').val();
                var input_client      = $('#input_client').val();
                var input_cost        = $('#input_cost').val(); 
                var input_where       = $('#input_where select').val(); 
                var input_consultant  = $('#input_consultant').html();
                var input_cmt         = $('#input_cmt').val(); 
                var input_start       = $('#input_start').val();
                var input_end         = $('#input_end').val(); 
                var input_facturable  = $('#input_facturable:checked').val(); 
                
                if(_debug){
                    console.log('input_type => '+input_type);
                    console.log('input_client => '+input_client);
                    console.log('input_where => '+input_where);
                    console.log('input_consultant => '+input_consultant);
                    console.log('input_cmt => '+input_cmt);
                    console.log('input_start => '+input_start);
                    console.log('input_end => '+input_end);
                    console.log('input_facturable => '+input_facturable);
                }
                
                input_start       = $.functionsApp.getDateGoole(input_start);
                input_end         = $.functionsApp.getDateGoole(input_end); 
                
                var gardian = true;
                var strError = "";
                
                if(input_type == "null"){gardian = false;strError += "Type is wrong.\n";}
                if(input_where == "null"){gardian = false;strError += "Where is wrong.\n";}
                if(input_consultant == "null"){gardian = false;strError += "Consultant is wrong.\n";}
                if(input_client == ""){gardian = false;strError += "Client is wrong.\n";}
                if(input_cost == ""){gardian = false;strError += "Periode is wrong.\n";}
                if(input_start == null){gardian = false;strError += "Start date is wrong.\n";}
                if(input_end == null){gardian = false;strError += "End date is wrong.\n";}
                if(input_start == input_end){gardian = false;strError += "Start date and end date are same.\n";}
                if((input_facturable != null)&&(input_type != "EXP")&&(input_type != "TRAINING")){gardian = false;strError += "Type is not allowed for facturable.\n";}
                
                if(!gardian){
                    alert('Bad entries, please check them.\n'+strError);
                }else{
                    $('#divAction').html('');
                    $('#divMsg').html('<b>Waiting...</b>');
                    
                    var res = input_cmt.substring(0, 5);

                    var strFac = "FREE";
                    if(input_facturable){
                        strFac = "a0jD";
                    }

                    var summary = input_type+"-"+input_client+"("+res+")-"+input_cost+"-"+input_where+"-"+strFac+"-"+input_consultant;

                    var resource = {
                        "summary": summary,
                        "location": input_where,
                        "description": input_cmt,
                        "start": {
                          "dateTime": input_start
                        },
                        "end": {
                          "dateTime": input_end
                        },
                        "source": {
                            "url": "https://consultant.cloud.bonitasoft.com/bonita/",
                            "title": "Clound Consultant Form Activity"
                        }
                    };
                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'bonitasoft.com_r6cu21kekpfg8ucd1ap6fm3h58@group.calendar.google.com',
                        'resource': resource
                    });

                    if(_debug){
                        console.log(resource);
                        alert(JSON.stringify(resource));
                        $('#divMsg').html("<b>Confirmed! DEBUG</b> (Auto submit 3s)");
                        window.setTimeout($.functionsApp.submitForm,3000);
                    }else{
                        request.execute(function(resp) {
                            if(resp.status == "confirmed"){
                                $('#divMsg').html("<b>Confirmed!</b> (Auto submit 3s)");
                                window.setTimeout($.functionsApp.submitForm,3000);
                            }else{
                                $('#divMsg').html(JSON.stringify(resp));
                            }
                        });
                    }
                }
                
                console.log("$.functionsApp.createAppointment finish.");
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.createAppointment :" + er.message);
            }
        }
        ,submitForm : function() {
            try{
                $("#bt_finish").click();
            } catch (er) {
                console.log(0, "ERROR - $.functionsApp.submitForm :" + er.message);
            }
        }
    };

    // Initialize
    _init();

})();