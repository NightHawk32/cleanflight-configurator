'use strict';

TABS.advanced = {
    available: false
};
TABS.advanced.initialize = function (callback) {
  
    //trowing away old values, re-fetch values
    PARAM_DESC_LIST = [];
    PARAM_LIST = [];
    var paramIndex = 0;
    
    // this should go to a json file
    // name, description, .....
    var GROUP_INFO = [
      {"name":"System"},
      {"name":"Sensor"},
      {"name":"RC"},
      {"name":"Drive"},
      {"name":"Motor Mix"},
    ];
    
    // group,id
    // name, description, defaults, ....
    var VAR_INFO = {
      "0,0": {"name":"Hello"},
      "0,1": {"name":"Looptime"},
      "0,2": {"name":"EMF Avoidance"},
      
      "1,0": {"name":"Align Gyro"},
      "1,1": {"name":"Align Acc"},
      "1,2": {"name":"Align Mag"},
      "1,3": {"name":"Gyro LPF"},
      "1,4": {"name":"Acc Zero"},
      "1,5": {"name":"Acc Gain"},
      "1,6": {"name":"Mag Zero"},
      
      "2,0": {"name":"Mid"},
      "2,1": {"name":"Min Check"},
      "2,2": {"name":"AMax Check"},
      "2,3": {"name":"RSSI Channel"},
      "2,4": {"name":"RSSI Scale"},
      "2,5": {"name":"RSSI PPM Invert"},
      "2,6": {"name":"RC Smoothing"},
      "2,7": {"name":"Input Filtering Mode"},
      
      "3,0": {"name":"Min Throttle"},
      "3,1": {"name":"Max Throttle"},
      "3,2": {"name":"Min Command"},
      
      "4,0": {"name":"Motor 0"},
      "4,1": {"name":"Motor 1"},
      "4,2": {"name":"Motor 2"},
      "4,3": {"name":"Motor 3"},
      "4,4": {"name":"Motor 4"},
      "4,5": {"name":"Motor 5"},
      "4,6": {"name":"Motor 6"},
      "4,7": {"name":"Motor 7"},
      "4,8": {"name":"Motor 8"},
      "4,9": {"name":"Motor 9"},
      "4,10": {"name":"Motor 10"},
      "4,11": {"name":"Motor 11"},
    };
    
    var DATA_TYPES = {
       'VAR_UINT8'      :0,
       'VAR_INT8'       :1,
       'VAR_UINT16'     :2,
       'VAR_INT16'      :3,
       'VAR_UINT32'     :4,
       'VAR_FLOAT'      :5,
       'VAR_INT16_XYZ'  :6,
       'VAR_MMIX'       :7,
    };
    
    if (GUI.active_tab != 'advanced') {
        GUI.active_tab = 'advanced';
        googleAnalytics.sendAppView('advanced');
    }
    
    function collapse_all() {
       $('li.bar').trigger('click');
    }
    
    function generate_output() {
       PARAM_LIST.forEach(function(elementGroup,indexGroup){
          $('ul.paramtree').append('<li id="group'+indexGroup+'" class="bar open">'
                                +'<div class="group'+indexGroup+' icon opened"><a href="#"></a></div>'
                                +'<a href="#">'+GROUP_INFO[indexGroup]["name"]+'</a>'
                                +'</li>'
                                +'<div class="group'+indexGroup+' treecontent">'
                                +'</div>'
                                );
          elementGroup.forEach(function(elementVar,indexVar){
              $('div.group'+indexGroup+'.treecontent').append('<div id="var'+indexVar+'" class="variable">'
                                              +'<div class="one">'+VAR_INFO[indexGroup+","+indexVar]["name"]+'</div>'
                                              +'<div class="two"><input /></div>'
                                              +'<div class="three">min: '+PARAM_LIST[indexGroup][indexVar]["value_min"]+'</div>'
                                              +'<div class="four">max: '+PARAM_LIST[indexGroup][indexVar]["value_max"]+'</div>'
                                              +'<div class="five">default: xxx</div>'
                                              +'</div>'
                                              );
          });
       });
       
    }
    
    function decode_msp_param_values() {
        PARAM_LIST.forEach(function(elementGroup,indexGroup){
           elementGroup.forEach(function(elementVar,indexVar){
	     var offset=0;
	     var values=[];
	     var data = new DataView(PARAM_LIST[indexGroup][indexVar]['value']);
	     var data_type = PARAM_LIST[indexGroup][indexVar]['data_type'];
	     
	     switch (data_type) {
	       case DATA_TYPES['VAR_UINT8']:
		 for(i=0;i<8;i++){
		   values[i]=data.getUint8(offset,1);
		   offset+=1;
		 }
		 break;
	       case DATA_TYPES['VAR_INT8']:
		 for(i=0;i<8;i++){
		   values[i]=data.getInt8(offset,1);
		   offset+=1;
		 }
		 break;
	       case DATA_TYPES['VAR_UINT16']:
		 for(i=0;i<8;i++){
		   values[i]=data.getUint16(offset,1);
		   offset+=2;
		 }
		 break;
	       case DATA_TYPES['VAR_INT16']:
		 for(i=0;i<8;i++){
		   values[i]=data.getInt16(offset,1);
		   offset+=2;
		 }
		 break;
	       case DATA_TYPES['VAR_UINT32']:
		 for(i=0;i<8;i++){
		   values[i]=data.getUint32(offset,1);
		   offset+=4;
		 }		 
		 break;
	       case DATA_TYPES['VAR_FLOAT']:
		 for(i=0;i<8;i++){
		   values[i]=data.getFloat32(offset,1);
		   offset+=4;
		 }
		 break;
	       case DATA_TYPES['VAR_INT16_XYZ']:
		 for(i=0;i<8;i++){
		   values[i]=data.getInt16(offset,1);
		   offset+=2;
		 }
		 break;
	       case DATA_TYPES['VAR_MMIX']:
		 for(i=0;i<8;i++){
		   values[i]=data.getFloat32(offset,1);
		   offset+=4;
		 }
		 break;
	     }
	     PARAM_LIST[indexGroup][indexVar]['value']=values;
           });
        });
        load_html();       
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
          decode_msp_param_values();          
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

        generate_output();

        $(".paramtree").on("click", "li.bar", function(){
           var id=$(this).attr("id");
           if($(this).hasClass("open")) {
              $(this).removeClass("open");
              $(".icon",this).removeClass("opened");
              $(".icon",this).addClass("closed");
              $("."+id+".treecontent").hide();
           }else{
              $(this).addClass("open");
              $(".icon",this).removeClass("closed");
              $(".icon",this).addClass("opened");
              $("."+id+".treecontent").show();
           }
           console.log('click');
        });
        
        collapse_all();
        GUI.content_ready(callback);
    }
};

TABS.advanced.cleanup = function (callback) {
    if (callback) callback();
};