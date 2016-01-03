'use strict';

TABS.advanced = {
    available: false
};
TABS.advanced.initialize = function (callback) {
    PARAM_LIST = undefined;
    var index = 0;
    var buffer = [];
    buffer.push(lowByte(index));
    buffer.push(highByte(index))
    
    if (GUI.active_tab != 'advanced') {
        GUI.active_tab = 'advanced';
        googleAnalytics.sendAppView('advanced');
    }
    
    if (CONFIGURATOR.connectionValid) {
        TABS.advanced.available = semver.gte(CONFIG.apiVersion, "1.6.0");
        
        if (!TABS.advanced.available) {
            load_html();
            return;
        }
        
        MSP.send_message(MSP_codes.MSP_PARAM_LIST, buffer, false, load_html);
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