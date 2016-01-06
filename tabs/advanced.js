'use strict';

TABS.advanced = {
    available: false
};
TABS.advanced.initialize = function (callback) {
  
    //trowing away old values, re-fetch values
    PARAM_DESC_LIST = [];
    PARAM_LIST = [];
    var paramIndex = 0;
    
    var DATA_TYPES = [
       'VAR_UINT8',
       'VAR_INT8',
       'VAR_UINT16',
       'VAR_INT16',
       'VAR_UINT32',
       'VAR_FLOAT',
       'VAR_INT16_XYZ',
       'VAR_MMIX'
    ];
    
    if (GUI.active_tab != 'advanced') {
        GUI.active_tab = 'advanced';
        googleAnalytics.sendAppView('advanced');
    }
    
    function decode_msp_param_values() {
        
       
       
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
       if(paramIndex < paramDescLength && PARAM_DESC_LIST[paramIndex] != undefined) {
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
          
    get_msp_param_desc_list();
    
    function load_html() {
        $('#content').load("./tabs/advanced.html", process_html);
    }
    
    function process_html() {
      
        // translate to user-selected language
        localize();
	
	$(".paramtree").on("click", "li.bar", function(){
	   var id=$(this).attr("id");
	   if($(this).hasClass("open")) {
	      $(this).removeClass("open");
	      $("icon",this).removeClass("opened");
	      $("icon",this).addClass("closed");
	      $("."+id+".treecontent").hide();
	   }else{
	      $(this).addClass("open");
	      $("icon",this).removeClass("closed");
	      $("icon",this).addClass("opened");
	      $("."+id+".treecontent").show();
	   }
           console.log('click');
        });

        GUI.content_ready(callback);
    }
};

TABS.advanced.cleanup = function (callback) {
    if (callback) callback();
};