'use strict';

TABS.advanced = {
    available: false
};
TABS.advanced.initialize = function (callback) {
    PARAM_DESC_LIST = [];
    PARAM_LIST = [];
    var paramIndex = 0;
    
    if (GUI.active_tab != 'advanced') {
        GUI.active_tab = 'advanced';
        googleAnalytics.sendAppView('advanced');
    }
    
    function get_msp_param(group,id,callback) {
        var buffer = [];
        buffer.push(group);
        buffer.push(lowByte(id));
        buffer.push(highByte(id));
        MSP.send_message(MSP_codes.MSP_PARAM, buffer, false, callback);
    }
    
    function get_msp_param_list() {
       var paramDescLength = PARAM_DESC_LIST.length;
       if(paramIndex < paramDescLength) {
          var group = PARAM_DESC_LIST[paramIndex]['group_id'];
          var id = PARAM_DESC_LIST[paramIndex]['param_id'];
          get_msp_param(group,id,get_msp_param_list);
	  paramIndex++;
       } else {
	  load_html(); 
       }
    }
    
    function get_msp_param_desc_list() {
        var buffer = [];
        if( PARAM_DESC_LIST.length != 0) {
	    var currentIndex=PARAM_DESC_LIST.length-1;
	    if( currentIndex < PARAM_DESC_LIST[currentIndex]['param_count']-1 ) {
	        buffer.push(lowByte( currentIndex+1 ));
                buffer.push(highByte( currentIndex+1 ));
	        MSP.send_message(MSP_codes.MSP_PARAM_LIST, buffer, false, get_msp_param_desc_list);
	    } else {
	        console.log(PARAM_DESC_LIST.length + ' MSP param descriptors fetched');
		get_msp_param_list()
	    } 
	} else {
	    buffer.push( 0 );
            buffer.push( 0 );
	    MSP.send_message(MSP_codes.MSP_PARAM_LIST, buffer, false, get_msp_param_desc_list);
	}
    }
    
    if (CONFIGURATOR.connectionValid) {
        
        get_msp_param_desc_list()
    }
    
    function load_html() {
        $('#content').load("./tabs/advanced.html", function() {
            create_html();
        });
    }
    
    function update_html() {
        
    }
    
    function create_html() {
        
        // translate to user-selected language
        localize();
       

        if (TABS.advanced.available) {
            /*var supportsDataflash = DATAFLASH.totalSize > 0;
            
            $(".tab-dataflash").toggleClass("supported", supportsDataflash);

            if (supportsDataflash) {
                // UI hooks
                $('.tab-dataflash a.erase-flash').click(ask_to_erase_flash);
                
                $('.tab-dataflash a.erase-flash-confirm').click(flash_erase);
                $('.tab-dataflash a.erase-flash-cancel').click(flash_erase_cancel);
        
                $('.tab-dataflash a.save-flash').click(flash_save_begin);
                $('.tab-dataflash a.save-flash-cancel').click(flash_save_cancel);
                $('.tab-dataflash a.save-flash-dismiss').click(dismiss_saving_dialog);
                
                update_html();
            } else {
                $(".tab-dataflash .note_spacer").html(chrome.i18n.getMessage('dataflashNotSupportedNote'));
            }*/
        } else {
            /*$(".tab-dataflash").removeClass("supported");
            $(".tab-dataflash .note").html(chrome.i18n.getMessage('dataflashFirmwareUpgradeRequired'));*/
        }

        
        GUI.content_ready(callback);
    }
};

TABS.advanced.cleanup = function (callback) {
    if (callback) callback();
};