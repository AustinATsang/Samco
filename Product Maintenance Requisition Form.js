/*******************************************************************************************************
* The code from this section is executed once the form is loaded.                                      *
*                                                                                                      *
* Depending on the stage of the form lifecycle when a particular action should be performed,           *
* you can use on the following hooks:                                                                  *
*                                                                                                      *
* fd.rendered()     the code is executed once the form is rendered                                     *
*                                                                                                      *
* fd.beforeSave()   the code is executed right before saving the form. If returns Promise, the saving  *
*                   does not proceed until the Promise is resoved. If the Promise is rejected,         * 
*                   the saving interrupts. This is the appropriate place for adding custom validation. *
*                                                                                                      *
* fd.saved()        the code is executed once the form is submitted                                    *
*                                                                                                      *
* The following predefined variables can be utilized in the code:                                      *
*                                                                                                      *
* fd    an instance of the current form                                                                *
* $     jQuery object                                                                                  *
*                                                                                                      *
*******************************************************************************************************/
/* Austin Tsang
*/

fd.rendered(function () {
    //disabling the ability to change the comm code and FC sample
    disableAllTabs();
    var thick = fd.field('Thickness').value;
    var thickNum = fd.field('ThicknessNum').value;
    var thickDen = fd.field('ThicknessDen').value;
    var width = fd.field('Width').value;
    var widthNum = fd.field('WidthNum').value;
    var widthDen = fd.field('WidthDen').value;
    var length = fd.field('Length').value;
    var lengthNum = fd.field('LengthNum').value;
    var lengthDen = fd.field('LengthDen').value;
    var cost = fd.field('Cost').value;
    var typeOfPart = fd.field('TypeOfPart').value;
    var thickFraction;
    var widthFraction;
    var lengthFraction;
    var fNum;
    var fDen;
    var firstD = '!'; 
    var secondD = '!';
    var thirdD = '!'; 
    var fourthD = '!';
    var fifthD = '!';
    var sixthD = '!';
    
    //checks what type of number needs to be created
    function numberTypeCheck(){
        if (fd.field('NumberType').value == 'R Number'){
            fd.field('TypeOfPart').widget.dataSource.data(['Flame Cut','Laser Cut','Castings','Solid Bar','Solid Structural','Tubing','Sheet']);
            disableAllTabs();
            tabCheck();
            fd.field('Cost').value = 0;
            disableDefaults();
            rCommCode();
        }
        if (fd.field('NumberType').value == 'P Number'){
            fd.field('TypeOfPart').widget.dataSource.data(['Miscellaneous','Air Tanks','Bearings','Belts','Brakes/Clutches','Chain/Tightener','Coolant Pumps + Components','Conveyors','Couplings','Cylinders/Actuators','Die Supplies','Finished Purchases','Fittings','Gauging Supplies','Gearboxes','Gears','Guarding','Hoses','Locknuts/Lockwashers','Paint','Pillow Blocks','Rotary Unions','Retaining Rings','Seals/O Rings','Springs','Sprockets/Pulleys/Bushings','Tubing','Valves']);
            disableAllTabs();
            fd.field('PurchasedPart').disabled = false;
            fd.field('PurchasedPart').hidden = false;
            fd.field('FCSample').value = '';
            enableDefaults();
            pCommCode();
        }
        if (fd.field('NumberType').value == 'F Number'){
            fd.field('TypeOfPart').widget.dataSource.data(['Nuts','Locating Components','Screws','Set Screws','Washers']);
            fd.field('TypeF').widget.dataSource.data(['Test']);
            disableAllTabs();
            fd.field('TypeF').disabled = false;
            fd.field('TypeF').hidden = false;
            fd.field('Diameter').disabled = false;
            fd.field('Diameter').hidden = false;
            fd.field('DiaFraction').disabled = false;
            fd.field('DiaFraction').hidden = false;
            enableDefaults();
            fCommCode();
        }
        if(fd.field('NumberType').value == 'E Number'){
            fd.field('TypeOfPart').widget.dataSource.data(['AC Drives','Boxes','Conduit','Connectors','Controllers','Counters','Disconnects','Fasteners','Fittings','Fuse Holders','Fuses','Motor Starter Contactors','Motors','Panel Components','Pilot Devices','Plugs','Power Distribution','Power Supplies','Relays','Sensors','Servos','Terminals','Timers','Transformers','Wire','Wire Management','Miscellaneous','Electrical Assemblies']);
            disableAllTabs();
            fd.field('PurchasedPart').disabled = false;
            fd.field('PurchasedPart').hidden = false;
            fd.field('FCSample').value = '';
            enableDefaults();
            eCommCode();
        }
    }
    
    //function to generate p comm codes
    function pCommCode(){
        digitReset();
        firstD = 'P';
        fd.field('FCSample').disabled = false;
        fd.field('PurchasedPart').required = false;
        fd.field('SubType').required = false;
        fd.field('Cost').disabled = false;
        fd.field('Cost').value = 0;
        fd.field('Description').required = true;
        if (fd.field('TypeOfPart').value == 'Miscellaneous'){
            secondD = 'Z';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Air Tanks'){
            secondD = '1';
            fd.field('PurchasedPart').widget.dataSource.data(['Air Tanks','Air Preparation Components','Flow Controls','Quick Exhaust','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Air Tanks'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Air Preparation Components'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Flow Controls'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Quick Exhaust'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Bearings'){
            secondD = '2';
            fd.field('PurchasedPart').widget.dataSource.data(['Tapered','Ball Bearing','Linear Slide','Bronze Bushing/Thrust Washer','Thrust Bearing','Needle/Inner Race','Cam Roller','SB Cam Follower','Casters and Ball Transfers','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Tapered'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Ball Bearing'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Linear Slide'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Bronze Bushing/Thrust Washer'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Thrust Bearing'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Needle/Inner Race'){thirdD = '7'}
            else if (fd.field('PurchasedPart').value == 'Cam Roller'){thirdD = '8'}
            else if (fd.field('PurchasedPart').value == 'SB Cam Follower'){thirdD = '9'}
            else if (fd.field('PurchasedPart').value == 'Casters and Ball Transfers'){thirdD = 'A'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Belts'){
            secondD = '3';
            fd.field('PurchasedPart').widget.dataSource.data(['V Belt','Timing Belt']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'V Belt'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Timing Belt'){thirdD = '2'}
        }
        else if (fd.field('TypeOfPart').value == 'Brakes/Clutches'){
            secondD = '4';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Chain/Tightener'){
            secondD = '5';
            fd.field('PurchasedPart').widget.dataSource.data(['Link Chain','Plastic Chain','Chain Tightener']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Link Chain'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Plastic Chain'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Chain Tightener'){thirdD = '3'}
        }
        else if (fd.field('TypeOfPart').value == 'Coolant Pumps + Components'){
            secondD = '6';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Conveyors'){
            secondD = '7';
            fd.field('SubType').hidden = false;
            fd.field('SubType').disabled = false;
            fd.field('PurchasedPart').widget.dataSource.data(['Powered','Non-Powered','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            fd.field('SubType').required = true;
            if (fd.field('PurchasedPart').value == 'Powered'){
                thirdD = '1';
                fd.field('SubType').widget.dataSource.data(['Belt Conveyor','Roller Conveyor','Magnetic Conveyor']);
                if (fd.field('SubType').value == 'Belt Conveyor'){fourthD = '1'}
                else if (fd.field('SubType').value == 'Roller Conveyor'){fourthD = '2'}
                else if (fd.field('SubType').value == 'Magnetic Conveyor'){fourthD = '3'}
            }
            else if (fd.field('PurchasedPart').value == 'Non-Powered'){
                thirdD = '2';
                fd.field('SubType').widget.dataSource.data(['Belt Conveyor','Roller Conveyor']);
                if (fd.field('SubType').value == 'Belt Conveyor'){fourthD = '1'}
                else if (fd.field('SubType').value == 'Roller Conveyor'){fourthD = '2'}
            }
            else {
                fourthD = '3';
                fifthD = 'Z';
                fd.field('SubType').required = false;
                fd.field('SubType').hidden = true;
                fd.field('SubType').disabled = true;
            }
        }
        else if (fd.field('TypeOfPart').value == 'Couplings'){
            secondD = '8';
            fd.field('PurchasedPart').widget.dataSource.data(['Chain Couplings','Jaw Type Coupling (Love-Joy)','Universal Joint','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Chain Couplings'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Jaw Type Coupling (Love-Joy)'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Universal Joint'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Cylinders/Actuators'){
            secondD = '9';
            fd.field('PurchasedPart').widget.dataSource.data(['Hydraulic','Pneumatic','Gas','Hydraulic Accessories','Pneumatic Accessories','Gas Accessories','Mechanical Actuator']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hydraulic'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Pneumatic'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Gas'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Hydraulic Accessories'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Pneumatic Accessories'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Gas Accessories'){thirdD = '6'}
            else if (fd.field('PurchasedPart').value == 'Mechanical Actuator'){thirdD = '7'}
        }
        else if (fd.field('TypeOfPart').value == 'Die Supplies'){
            secondD = 'A';
            fd.field('PurchasedPart').widget.dataSource.data(['Punch & Die Buttons','Dies Shoes','Bushings','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Punch & Die Buttons'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Dies Shoes'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Bushings'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Finished Purchases'){
            secondD = 'B';
            fd.field('PurchasedPart').widget.dataSource.data(['Hydraulics','Electrics','Welders','Servo Feeds','Dies','Central Lube System','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hydraulics'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Electrics'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Welders'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Servo Feeds'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Dies'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Central Lube System'){thirdD = '6'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Fittings'){
            secondD = 'C';
            fd.field('PurchasedPart').widget.dataSource.data(['Hydraulic','Pneumatic','Grease Nipples','Steel Piping','Plug','Pipe Fittings']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hydraulic'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Pneumatic'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Grease Nipples'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Steel Piping'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Plug'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Pipe Fittings'){thirdD = '6'}
        }
        else if (fd.field('TypeOfPart').value == 'Gauging Supplies'){
            secondD = 'D';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Gearboxes'){
            secondD = 'E';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Gears'){
            secondD = 'F';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Guarding'){
            secondD = 'G';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Hoses'){
            secondD = 'H';
            fd.field('PurchasedPart').widget.dataSource.data(['Hydraulic','Pneumatic','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hydraulic'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Pneumatic'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Locknuts/Lockwashers'){
            secondD = 'J';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Paint'){
            secondD = 'N';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Pillow Blocks'){
            secondD = 'Q';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Rotary Unions'){
            secondD = 'R';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Retaining Rings'){
            secondD = 'S';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Seals/O Rings'){
            secondD = 'T';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Springs'){
            secondD = 'U';
            fd.field('PurchasedPart').widget.dataSource.data(['Die Springs','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Die Springs'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Sprockets/Pulleys/Bushings'){
            secondD = 'V';
            fd.field('PurchasedPart').widget.dataSource.data(['Sprockets','Pulleys','Tapered Bushings']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Sprockets'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Pulleys'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Tapered Bushings'){thirdD = '3'}
        }
        else if (fd.field('TypeOfPart').value == 'Tubing'){
            secondD = 'W';
            fd.field('PurchasedPart').widget.dataSource.data(['Copper','Steel','Plastic','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Copper'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Steel'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Plastic'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Valves'){
            secondD = 'X';
            fd.field('PurchasedPart').widget.dataSource.data(['Hydraulic','Pneumatic','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hydraulic'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Pneumatic'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        fd.field('CommCode').value = firstD+secondD+thirdD+fourthD+fifthD+sixthD;
    }
    
    //function to generate F comm codes
    function fCommCode(){
        digitReset();
        firstD = 'F';
        fd.field('FCSample').disabled = false;
        fd.field('TypeF').required = false;
        fd.field('Cost').disabled = false;
        fd.field('Cost').value = 0;
        ///////////////////////////////////////////////////////////////////////////////////////BREAKING HERE/////////////////////////////////////////////////////////////////////////////////
        if (fd.field('TypeOfPart').value == 'Nuts'){
            secondD = '1';
            fd.field('TypeF').widget.dataSource.data(['Hex Nut','Hex Jam Nut','Square Nut','Heavy Hex Nut/Jam Nut','Self Locking','Left Hand Nut','Miscellaneous']);
            fd.field('Thread').disabled = false;
            fd.field('Thread').hidden = false;
            fd.field('Thread').required = true;
            fd.field('TypeF').required = true;
            if (fd.field('TypeF').value == 'Hex Nut'){thirdD = '1'}
            else if (fd.field('TypeF').value == 'Hex Jam Nut'){thirdD = '2'}
            else if (fd.field('TypeF').value == 'Square Nut'){thirdD = '3'}
            else if (fd.field('TypeF').value == 'Heavy Hex Nut/Jam Nut'){thirdD = '4'}
            else if (fd.field('TypeF').value == 'Self Locking'){thirdD = '5'}
            else if (fd.field('TypeF').value == 'Left Hand Nut'){thirdD = '6'}
            else if (fd.field('TypeF').value == 'Miscellaneous'){thirdD = 'Z'}
            
            fractionBreakDown(fd.field('DiaFraction').value);
    
            if (fd.field('DiaFraction').value == 'Metric'){fd.field('Diameter').disabled = true;fourthD = 'X';}
            else if (fd.field('DiaFraction').value == 'Miscellaneous'){fd.field('Diameter').disabled = true;fourthD = 'Z';}
            else if (fd.field('Diameter').value+(fNum/fDen) <= 0.625){fourthD = '1'}
            else if (fd.field('Diameter').value+(fNum/fDen) <= 1){fourthD = '2'}
            else if (fd.field('Diameter').value+(fNum/fDen) <= 1.5){fourthD = '3'}
            else if (fd.field('Diameter').value+(fNum/fDen) > 1.5){fourthD = '4'}
            
            if (fd.field('Thread').value == 'UNC'){fifthD = '1'}
            else if (fd.field('Thread').value == 'UNF'){fifthD = '2'}
        }
        if (fd.field('TypeOfPart').value == 'Locating Components'){
            secondD = '2';
            fd.field('TypeF').widget.dataSource.data(['Cotter Pin','Spring Pin','Taper Pin','Dowel Pin','Rivet','Collars','Quick Release Lock Pin','Inserts','Miscellaneous']);
            fd.field('LengthF').disabled = false;
            fd.field('LengthF').hidden = false;
            fd.field('LenFraction').disabled = false;
            fd.field('LenFraction').hidden = false;
            fd.field('LengthF').required = true;
            fd.field('LenFraction').required = true;
            if (fd.field('TypeF').value == 'Cotter Pin'){thirdD = '1'}
            else if (fd.field('TypeF').value == 'Spring Pin'){thirdD = '2'}
            else if (fd.field('TypeF').value == 'Taper Pin'){thirdD = '3'}
            else if (fd.field('TypeF').value == 'Dowel Pin'){thirdD = '4'}
            else if (fd.field('TypeF').value == 'Rivet'){thirdD = '5'}
            else if (fd.field('TypeF').value == 'Collars'){thirdD = '6'}
            else if (fd.field('TypeF').value == 'Quick Release Lock Pin'){thirdD = '7'}
            else if (fd.field('TypeF').value == 'Inserts'){thirdD = '8'}
            else if (fd.field('TypeF').value == 'Miscellaneous'){thirdD = 'Z'}
            
            fractionBreakDown(fd.field('DiaFraction').value);
            
            if (fd.field('Diameter').value+(fNum/fDen) <= 0.375){fourthD = '1'}
            else {fourthD = '2'}
            
            if (fd.field('LengthF').value == 2 && fd.field('LenFraction').value == '0'){fifthD = '1'}
            else if (fd.field('LengthF').value < 2){fifthD = '1'}
            else {fifthD = '2'}
        }
        if (fd.field('TypeOfPart').value == 'Screws'){
            secondD = '3';
            fd.field('TypeF').widget.dataSource.data(['SHCS','HHCS','FHCS','SHSB','Eye Bolt','Stud','BHCS','Miscellaneous']);
            fd.field('LengthF').disabled = false;
            fd.field('LengthF').hidden = false;
            fd.field('LenFraction').disabled = false;
            fd.field('LenFraction').hidden = false;
            fd.field('Thread').disabled = false;
            fd.field('Thread').hidden = false;
            fd.field('LengthF').required = true;
            fd.field('LenFraction').required = true;
            fd.field('Thread').required = true;
            
            if (fd.field('TypeF').value == 'SHCS'){thirdD = '1'}
            else if (fd.field('TypeF').value == 'HHCS'){thirdD = '2'}
            else if (fd.field('TypeF').value == 'FHCS'){thirdD = '3'}
            else if (fd.field('TypeF').value == 'SHSB'){thirdD = '4'}
            else if (fd.field('TypeF').value == 'Eye Bolt'){thirdD = '5'}
            else if (fd.field('TypeF').value == 'Stud'){thirdD = '6'}
            else if (fd.field('TypeF').value == 'BHCS'){thirdD = '7'}
            else if (fd.field('TypeF').value == 'Miscellaneous'){thirdD = 'Z'}
            
            fractionBreakDown(fd.field('DiaFraction').value);
    
            if (fd.field('DiaFraction').value == 'Metric'){fd.field('Diameter').disabled = true;fourthD = 'X';}
            else if (fd.field('DiaFraction').value == 'Miscellaneous'){fd.field('Diameter').disabled = true;fourthD = 'Z';}
            else if (fd.field('DiaFraction').value == '#6, #8, #10, #12'){fd.field('Diameter').disabled = true;fourthD = '1';}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.25){fourthD = '2'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.3125){fourthD = '3'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.375){fourthD = '4'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.5){fourthD = '5'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.625){fourthD = '6'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.75){fourthD = '7'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.875){fourthD = '8'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1){fourthD = '9'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.125){fourthD = 'A'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.25){fourthD = 'B'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.375){fourthD = 'C'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.5){fourthD = 'D'}
            
            
            if (fd.field('Thread').value == 'UNC'){fifthD = '1'}
            else if (fd.field('Thread').value == 'UNF'){fifthD = '2'}
            
            if (fd.field('LengthF').value == 2 && fd.field('LenFraction').value == '0'){sixthD = '1'}
            else if (fd.field('LengthF').value == 4 && fd.field('LenFraction').value == '0'){sixthD = '2'}
            else if (fd.field('LengthF').value < 2){sixthD = '1'}
            else if (fd.field('LengthF').value < 4){sixthD = '2'}
            else {sixthD = 3}
        }
        if (fd.field('TypeOfPart').value == 'Set Screws'){
            secondD = '4';
            fd.field('TypeF').widget.dataSource.data(['SSS','SQSS','Brass Tip','Miscellaneous']);
            fd.field('LengthF').disabled = false;
            fd.field('LengthF').hidden = false;
            fd.field('LenFraction').disabled = false;
            fd.field('LenFraction').hidden = false;
            fd.field('Thread').disabled = false;
            fd.field('Thread').hidden = false;
            fd.field('LengthF').required = true;
            fd.field('LenFraction').required = true;
            fd.field('Thread').required = true;
            
            if (fd.field('TypeF').value == 'SSS'){thirdD = '1'}
            else if (fd.field('TypeF').value == 'SQSS'){thirdD = '2'}
            else if (fd.field('TypeF').value == 'Brass Tip'){thirdD = '3'}
            else if (fd.field('TypeF').value == 'Miscellaneous'){thirdD = 'Z'}
            
            fractionBreakDown(fd.field('DiaFraction').value);
    
            if (fd.field('DiaFraction').value == 'Metric'){fd.field('Diameter').disabled = true;fourthD = 'X';}
            else if (fd.field('DiaFraction').value == 'Miscellaneous'){fd.field('Diameter').disabled = true;fourthD = 'Z';}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.25){fourthD = '2'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.3125){fourthD = '3'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.375){fourthD = '4'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.5){fourthD = '5'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.625){fourthD = '6'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.75){fourthD = '7'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 0.875){fourthD = '8'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1){fourthD = '9'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.125){fourthD = 'A'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.25){fourthD = 'B'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.375){fourthD = 'C'}
            else if (fd.field('Diameter').value+(fNum/fDen) == 1.5){fourthD = 'D'}
            else {fourthD = '1'}
            
            if (fd.field('Thread').value == 'UNC'){fifthD = '1'}
            else if (fd.field('Thread').value == 'UNF'){fifthD = '2'}
            
            if (fd.field('LengthF').value == 2 && fd.field('LenFraction').value == '0'){sixthD = '1'}
            else if (fd.field('LengthF').value == 4 && fd.field('LenFraction').value == '0'){sixthD = '2'}
            else if (fd.field('LengthF').value < 2){sixthD = '1'}
            else if (fd.field('LengthF').value < 4){sixthD = '2'}
            else {sixthD = 3}
        }
        if (fd.field('TypeOfPart').value == 'Washers'){
            secondD = '5';
            fd.field('TypeF').widget.dataSource.data(['SLW','Flat Washer','Belleville Washer','Miscellaneous']);
            
            if (fd.field('TypeF').value == 'SLW'){thirdD = '1'}
            else if (fd.field('TypeF').value == 'Flat Washer'){thirdD = '2'}
            else if (fd.field('TypeF').value == 'Belleville Washer'){thirdD = '3'}
            else if (fd.field('TypeF').value == 'Miscellaneous'){thirdD = 'Z'}
            
            fractionBreakDown(fd.field('DiaFraction').value);
    
            if (fd.field('DiaFraction').value == 'Metric'){fd.field('Diameter').disabled = true;fourthD = 'X';}
            else if (fd.field('DiaFraction').value == 'Miscellaneous'){fd.field('Diameter').disabled = true;fourthD = 'Z';}
            else if (fd.field('Diameter').value+(fNum/fDen) <= 0.875){fourthD = '1'}
            else if (fd.field('Diameter').value+(fNum/fDen) <= 1.5){fourthD = '2'}
            else {fourthD = '3'}
        }
        fd.field('CommCode').value = firstD+secondD+thirdD+fourthD+fifthD+sixthD;
    }
    
    //function to generate E comm codes
    function eCommCode(){
        digitReset();
        firstD = 'E';
        fd.field('FCSample').disabled = false;
        fd.field('PurchasedPart').required = false;
        fd.field('SubType').required = false;
        fd.field('SubType').hidden = true;
        fd.field('Cost').disabled = false;
        fd.field('Cost').value = 0;
        fd.field('Description').required = true;
        if(fd.field('TypeOfPart').value == 'AC Drives'){
            secondD = '1';
            fd.field('PurchasedPart').widget.dataSource.data(['575 Voltage','460 Voltage','380 Voltage','240 Voltage','120 Voltage','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == '575 Voltage'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == '460 Voltage'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == '380 Voltage'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == '240 Voltage'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == '120 Voltage'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Boxes'){
            secondD = '2';
            fd.field('PurchasedPart').widget.dataSource.data(['Junction Box','Cabinets','Operator Stations','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Junction Box'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Cabinets'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Operator Stations'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Conduit'){
            secondD = '3';
            fd.field('PurchasedPart').widget.dataSource.data(['Plastic','Sealtight','Rigid']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Plastic'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Sealtight'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Rigid'){thirdD = '3'}
        }
        else if (fd.field('TypeOfPart').value == 'Connectors'){
            secondD = '4';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Controllers'){
            secondD = '5';
            fd.field('SubType').hidden = false;
            fd.field('SubType').disabled = false;
            fd.field('SubType').required = true;
            fd.field('PurchasedPart').widget.dataSource.data(['AMS','PLC','Digital Displays','GE Fanuc','Beck Components','Videojet','Misc. HMIs','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'AMS'){
                thirdD = '1';
                fd.field('SubType').widget.dataSource.data(['Units','Accessories (no encoders)','Consoles']);
                if(fd.field('SubType').value == 'Units'){fourthD = '1'}
                else if(fd.field('SubType').value == 'Accessories (no encoders)'){fourthD = '2'}
                else if(fd.field('SubType').value == 'Consoles'){fourthD = '3'}
            }
            else if (fd.field('PurchasedPart').value == 'PLC'){
                thirdD = '2';
                fd.field('SubType').widget.dataSource.data(['OMRON','Allen Bradley','Siemens']);
                if(fd.field('SubType').value == 'OMRON'){fourthD = '1'}
                else if(fd.field('SubType').value == 'Allen Bradley'){fourthD = '2'}
                else if(fd.field('SubType').value == 'Siemens'){fourthD = '3'}
            }
            else if (fd.field('PurchasedPart').value == 'Digital Displays'){thirdD = '3';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'GE Fanuc'){thirdD = '4';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'Beck Components'){thirdD = '5';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'Videojet'){thirdD = '6';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'Misc. HMIs'){thirdD = '7';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
        }
        else if (fd.field('TypeOfPart').value == 'Counters'){
            secondD = '6';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Disconnects'){
            secondD = '7';
            fd.field('PurchasedPart').widget.dataSource.data(['Non Fuseable','Fuseable','Shaft','Handle','Lug','Cover','Circuit Breakers','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Non Fuseable'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Fuseable'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Shaft'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Handle'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Lug'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Cover'){thirdD = '6'}
            else if (fd.field('PurchasedPart').value == 'Circuit Breakers'){thirdD = '7'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Fasteners'){
            secondD = '8';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Fittings'){
            secondD = '9';
            fd.field('SubType').hidden = false;
            fd.field('SubType').disabled = false;
            fd.field('SubType').required = true;
            fd.field('PurchasedPart').widget.dataSource.data(['1/2"','3/4"','1"','1 1/4" Metal','1 1/2" Metal','2" Metal','Miscellaneous Fittings']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == '1/2"'){
                thirdD = '1';
                fd.field('SubType').widget.dataSource.data(['Metal','Plastic']);
                if(fd.field('SubType').value == 'Metal'){fourthD = '1'}
                else if(fd.field('SubType').value == 'Plastic'){fourthD = '2'}
            }
            else if (fd.field('PurchasedPart').value == '3/4"'){
                thirdD = '2';
                fd.field('SubType').widget.dataSource.data(['Metal','Plastic']);
                if(fd.field('SubType').value == 'Metal'){fourthD = '1'}
                else if(fd.field('SubType').value == 'Plastic'){fourthD = '2'}
            }
            else if (fd.field('PurchasedPart').value == '1"'){
                thirdD = '3';
                fd.field('SubType').widget.dataSource.data(['Metal','Plastic']);
                if(fd.field('SubType').value == 'Metal'){fourthD = '1'}
                else if(fd.field('SubType').value == 'Plastic'){fourthD = '2'}
            }
            else if (fd.field('PurchasedPart').value == '1 1/4" Metal'){thirdD = '4';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == '1 1/2" Metal'){thirdD = '5';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == '2" Metal'){thirdD = '6';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous Fittings'){thirdD = 'Z';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
        }
        else if(fd.field('TypeOfPart').value == 'Fuse Holders'){
            secondD = 'A';
            fd.field('PurchasedPart').widget.dataSource.data(['LPCC','LPJ','FWP','JJS','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'LPCC'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'LPJ'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'FWP'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'JJS'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Fuses'){
            secondD = 'B';
            fd.field('PurchasedPart').widget.dataSource.data(['LPCC','LPJ','FWP','FNM','JJS','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'LPCC'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'LPJ'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'FWP'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'FNM'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'JJS'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Motor Starter Contactors'){
            secondD = 'C';
            fd.field('PurchasedPart').widget.dataSource.data(['Starter Contactors','Overloads','Soft Starters','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Starter Contactors'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Overloads'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Soft Starters'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Motors'){
            secondD = 'D';
            fd.field('PurchasedPart').widget.dataSource.data(['575 Voltage','240 - 460 Voltage','120 Voltage','Motor Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == '575 Voltage'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == '240 - 460 Voltage'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == '120 Voltage'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Motor Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Panel Components'){
            secondD = 'E';
            fd.field('PurchasedPart').widget.dataSource.data(['Panel Components','Potentiometers']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Potentiometers'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Pilot Devices'){
            secondD = 'F';
            fd.field('PurchasedPart').widget.dataSource.data(['Push Button','Selector Switches','Pilot Light','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Push Button'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Selector Switches'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Pilot Light'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Plugs'){
            secondD = 'G';
            fd.field('PurchasedPart').widget.dataSource.data(['Hoods','Bases','Female Inserts','Male Inserts','Amphenol','Assorted']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Hoods'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Bases'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Female Inserts'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Male Inserts'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Amphenol'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Assorted'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Power Distribution'){
            secondD = 'H';
            fd.field('PurchasedPart').hidden = true;
        }
        else if (fd.field('TypeOfPart').value == 'Power Supplies'){
            secondD = 'J';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Relays'){
            secondD = 'K';
            fd.field('PurchasedPart').widget.dataSource.data(['Relays','Safety Relays','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Relays'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Safety Relays'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Sensors'){
            secondD = 'L';
            fd.field('PurchasedPart').widget.dataSource.data(['Limit','Proximity','Photo','Ultrasonic','Hall','Reed Switches','Cam Switches','Transducers','Light Curtains','Encoders','Safety Switches','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Limit'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Proximity'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Photo'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Ultrasonic'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Hall'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Reed Switches'){thirdD = '6'}
            else if (fd.field('PurchasedPart').value == 'Cam Switches'){thirdD = '7'}
            else if (fd.field('PurchasedPart').value == 'Transducers'){thirdD = '8'}
            else if (fd.field('PurchasedPart').value == 'Light Curtains'){thirdD = '9'}
            else if (fd.field('PurchasedPart').value == 'Encoders'){thirdD = 'A'}
            else if (fd.field('PurchasedPart').value == 'Safety Switches'){thirdD = 'B'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Servos'){
            secondD = 'M';
            fd.field('PurchasedPart').widget.dataSource.data(['Drives','Motors','Shunt Resistor','Gear Boxes','Ball Screw Cylinders','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Drives'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Motors'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Shunt Resistor'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Gear Boxes'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Ball Screw Cylinders'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if(fd.field('TypeOfPart').value == 'Terminals'){
            secondD = 'N';
            fd.field('PurchasedPart').widget.dataSource.data(['Units','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Units'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Timers'){
            secondD = 'P';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Transformers'){
            secondD = 'Q';
            fd.field('PurchasedPart').widget.dataSource.data(['Single Phase','Three Phase']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Single Phase'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Three Phase'){thirdD = '2'}
        }
        else if(fd.field('TypeOfPart').value == 'Wire'){
            secondD = 'R';
            fd.field('SubType').hidden = false;
            fd.field('SubType').disabled = false;
            fd.field('SubType').required = true;
            fd.field('PurchasedPart').widget.dataSource.data(['Single','Multi','Miscellaneous - Reels']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Single'){
                thirdD = '1';
                fd.field('SubType').widget.dataSource.data(['16 AWG','14 - 2 AWG','Greater than 2 AWG']);
                if(fd.field('SubType').value == '16 AWG'){fourthD = '1'}
                else if(fd.field('SubType').value == '14 - 2 AWG'){fourthD = '2'}
                else if(fd.field('SubType').value == 'Greater than 2 AWG'){fourthD = '3'}
            }
            else if (fd.field('PurchasedPart').value == 'Multi'){
                thirdD = '2';
                fd.field('SubType').widget.dataSource.data(['Shield','SOW','Conductor']);
                if(fd.field('SubType').value == 'Shield'){fourthD = '1'}
                else if(fd.field('SubType').value == 'SOW'){fourthD = '2'}
                else if(fd.field('SubType').value == 'Conductor'){fourthD = '3'}
            }
            else if (fd.field('PurchasedPart').value == 'Miscellaneous - Reels'){thirdD = 'Z';fourthD = '1';fd.field('SubType').required = false;fd.field('SubType').hidden = true;}
        }
        else if(fd.field('TypeOfPart').value == 'Wire Management'){
            secondD = 'S';
            fd.field('PurchasedPart').widget.dataSource.data(['Raceways','Accessories']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Raceways'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Accessories'){thirdD = 'Z'}
        }
        else if (fd.field('TypeOfPart').value == 'Miscellaneous'){
            secondD = 'Z';
            fd.field('PurchasedPart').hidden = true;
        }
        else if(fd.field('TypeOfPart').value == 'Electrical Assemblies'){
            secondD = 'X';
            fd.field('PurchasedPart').widget.dataSource.data(['Main/Rollformers (000-099)','Cut-Off Presses (100-199)','Pre-Punch Presses (200-299)','Flatteners (300-399)','Uncoilers/Extras (400-499)','Entry Systems (500-599)','BOM Sub Id Masters','Miscellaneous']);
            fd.field('PurchasedPart').required = true;
            if (fd.field('PurchasedPart').value == 'Main/Rollformers (000-099)'){thirdD = '1'}
            else if (fd.field('PurchasedPart').value == 'Cut-Off Presses (100-199)'){thirdD = '2'}
            else if (fd.field('PurchasedPart').value == 'Pre-Punch Presses (200-299)'){thirdD = '3'}
            else if (fd.field('PurchasedPart').value == 'Flatteners (300-399)'){thirdD = '4'}
            else if (fd.field('PurchasedPart').value == 'Uncoilers/Extras (400-499)'){thirdD = '5'}
            else if (fd.field('PurchasedPart').value == 'Entry Systems (500-599)'){thirdD = '6'}
            else if (fd.field('PurchasedPart').value == 'BOM Sub Id Masters'){thirdD = 'Y'}
            else if (fd.field('PurchasedPart').value == 'Miscellaneous'){thirdD = 'Z'}
        }
        fd.field('CommCode').value = firstD+secondD+thirdD+fourthD+fifthD+sixthD;
    }
    
    //resets all comm codes to null
    function digitReset(){
        firstD = '';
        secondD = '';
        thirdD = '';
        fourthD = '';
        fifthD = ''; 
        sixthD = '';
    }
    
    //checks if all the fractions are valid
    function fractionCheck(){
        if (thickNum == 0 || thickNum == null || thickDen == 0 || thickDen == null){
            thickNum = 0;
            thickDen = 1;
        }
        if (widthNum == 0 || widthNum == null || widthDen == 0 || widthDen == null){
            widthNum = 0;
            widthDen = 1;
        }
        if (lengthNum == 0 || lengthNum == null || lengthDen == 0 || lengthDen == null){
            lengthNum = 0;
            lengthDen = 1;
        }
        
        thickFraction = thick+(thickNum/thickDen);
        widthFraction = width+(widthNum/widthDen);
        lengthFraction = length+(lengthNum/lengthDen);
    }
    
    //converts fraction string to decimal
    function fractionBreakDown(frac){
        if(frac == '0'){fNum = 0;fDen = 1;}
        else if (frac == '1/16'){fNum = 1;fDen = 16;}
        else if (frac == '1/8'){fNum = 1;fDen = 8;}
        else if (frac == '3/16'){fNum = 3;fDen = 16;}
        else if (frac == '1/4'){fNum = 1;fDen = 4;}
        else if (frac == '5/16'){fNum = 5;fDen = 16;}
        else if (frac == '3/8'){fNum = 3;fDen = 8;}
        else if (frac == '7/16'){fNum = 7;fDen = 16;}
        else if (frac == '1/2'){fNum = 1;fDen = 2;}
        else if (frac == '9/16'){fNum = 9;fDen = 16;}
        else if (frac == '5/8'){fNum = 5;fDen = 8;}
        else if (frac == '11/16'){fNum = 11;fDen = 16;}
        else if (frac == '3/4'){fNum = 3;fDen = 4;}
        else if (frac == '13/16'){fNum = 13;fDen = 16;}
        else if (frac == '7/8'){fNum = 7;fDen = 8;}
        else if (frac == '15/16'){fNum = 15;fDen = 16;}
    }
    
    //function that generates a sample of what the product description would look like
    function generateSample(){
        if (fd.field('TypeOfPart').value == 'Flame Cut' || fd.field('TypeOfPart').value == 'Laser Cut'){
            fd.field('FCSample').disabled = true;
            thick = fd.field('Thickness').value;
            thickNum = fd.field('ThicknessNum').value;
            thickDen = fd.field('ThicknessDen').value;
            width = fd.field('Width').value;
            widthNum = fd.field('WidthNum').value;
            widthDen = fd.field('WidthDen').value;
            length = fd.field('Length').value;
            lengthNum = fd.field('LengthNum').value;
            lengthDen = fd.field('LengthDen').value;
            var thickDis = thick+' ';
            var widthDis = width+' ';
            var lengthDis = ' '+length;
            var thkFraction = thickNum+'/'+thickDen+' ';
            var wdFraction = widthNum+'/'+widthDen+' ';
            var lgFraction = ' '+lengthNum+'/'+lengthDen;
            var cut = '';
            
            if (thickNum == 0 || thickNum == null || thickDen == 0 || thickDen == null){thkFraction = '';}
            if (widthNum == 0 || widthNum == null || widthDen == 0 || widthDen == null){wdFraction = '';}
            if (lengthNum == 0 || lengthNum == null || lengthDen == 0 || lengthDen == null){lgFraction = '';}
            
            if(thick == 0 && fd.field('BGSR').value == false){thickDis = ''}
            if(width == 0){widthDis = ''}
            if(length == 0){lengthDis = ''}
            
            if(fd.field('TypeOfPart').value == 'Flame Cut'){cut = 'FC';}
            else if(fd.field('TypeOfPart').value == 'Laser Cut'){cut = 'LC';}
            
            if(fd.field('BGSR').value){
                var ratioNeg = thick+thickNum/thickDen-0.005;
                var ratioPos = thick+thickNum/thickDen+0.005;
                ratioNeg = ratioNeg.toFixed(3);
                ratioPos = ratioPos.toFixed(3);
                fd.field('FCSample').value = cut+' ('+ratioNeg+'/'+ratioPos+' B/G S/R X '+widthDis+wdFraction+'X'+lengthDis+lgFraction+')';
            }
            else{fd.field('FCSample').value = cut+' ('+thickDis+thkFraction+'X '+widthDis+wdFraction+'X'+lengthDis+lgFraction+')';}
        }
        else if (fd.field('TypeOfPart').value == 'Castings'){
            fd.field('FCSample').disabled = false;
            fd.field('FCSample').value = (fd.field('Part').value).toUpperCase();
        }
        else if (fd.field('TypeOfPart').value == 'Solid Bar'){
            fd.field('FCSample').disabled = false;
            fd.field('FCSample').value = (fd.field('Material').value).toUpperCase()+', 0 X 0';
        }
        else if (fd.field('TypeOfPart').value == 'Solid Structural'){
            fd.field('FCSample').disabled = false;
            fd.field('FCSample').value = (fd.field('MaterialSS').value).toUpperCase()+' '+(fd.field('ShapeSS').value).toUpperCase()+', 0 X 0 X 0';
        }
        else if (fd.field('TypeOfPart').value == 'Tubing'){
            fd.field('FCSample').disabled = false;
            fd.field('FCSample').value = (fd.field('MaterialT').value).toUpperCase()+' '+(fd.field('ShapeT').value).toUpperCase()+', 0 OD X 0 ID X 0';
        }
        else if (fd.field('TypeOfPart').value == 'Sheet'){
            fd.field('FCSample').disabled = false;
            fd.field('FCSample').value = (fd.field('Type').value).toUpperCase()+', 0 X 0 X 0';
        }
        else if (fd.field('TypeOfPart').value == 'Nuts'){fd.field('FCSample').value = (fd.field('TypeF').value).toUpperCase()+' ? X ? X ? '+(fd.field('Thread').value).toUpperCase();}
        else if (fd.field('TypeOfPart').value == 'Locating Components'){fd.field('FCSample').value = (fd.field('TypeF').value).toUpperCase()+' ? X ?';}
        else if (fd.field('TypeOfPart').value == 'Screws'){fd.field('FCSample').value = (fd.field('TypeF').value).toUpperCase()+' ? X ? '+(fd.field('Thread').value).toUpperCase();}
        else if (fd.field('TypeOfPart').value == 'Set Screws'){fd.field('FCSample').value = (fd.field('TypeF').value).toUpperCase()+' ? X ? X ? '+(fd.field('Thread').value).toUpperCase();}
        else if (fd.field('TypeOfPart').value == 'Washers'){fd.field('FCSample').value = (fd.field('TypeF').value).toUpperCase()+' ? ';}
    }
    
    //function to generate r comm codes
    function rCommCode(){
        digitReset();
        firstD = 'R';
        disableDefaults();
        fd.field('Description').required = false;
        if (fd.container('Tabs').tabs[0].disabled == false){
            fd.field('Unit').value = 'ea';
            if (fd.field('TypeOfPart').value == 'Flame Cut'){
                thick = fd.field('Thickness').value;
                thickNum = fd.field('ThicknessNum').value;
                thickDen = fd.field('ThicknessDen').value;
                width = fd.field('Width').value;
                widthNum = fd.field('WidthNum').value;
                widthDen = fd.field('WidthDen').value;
                length = fd.field('Length').value;
                lengthNum = fd.field('LengthNum').value;
                lengthDen = fd.field('LengthDen').value;
    
                secondD = '2';
                fd.field('BGSR').disabled = false;
                
                //creates third digit of comm code
                if (thickFraction > 0 && thickFraction <= 1){thirdD = 1;}
                else if (thickFraction <= 2){thirdD = 2;}
                else if (thickFraction <= 3){thirdD = 3;}
                else if (thickFraction <= 4){thirdD = 4;}
                else if (thickFraction <= 5){thirdD = 5;}
                else if (thickFraction <= 6){thirdD = 6;}
                else if (thickFraction > 6){thirdD = 7;}
                
                //creates fourth digit of comm code
                if (widthFraction > 0 && widthFraction <= 4){fourthD = 1;}
                else if (widthFraction <= 8){fourthD = 2;}
                else if (widthFraction <= 12){fourthD = 3;}
                else if (widthFraction <= 24){fourthD = 4;}
                else if (widthFraction <= 36){fourthD = 5;}
                else if (widthFraction <= 48){fourthD = 6;}
                else if (widthFraction <= 60){fourthD = 7;}
                else if (widthFraction <= 72){fourthD = 8;}
                else if (widthFraction <= 84){fourthD = 9;}
                else if (widthFraction <= 96){fourthD = 'A';}
                else if (widthFraction > 96){fourthD = 'B';}
                
                //creates fifth digit of comm code
                if (lengthFraction > 0 && lengthFraction <= 4){fifthD = 1;}
                else if (lengthFraction <= 8){fifthD = 2;}
                else if (lengthFraction <= 12){fifthD = 3;}
                else if (lengthFraction <= 24){fifthD = 4;}
                else if (lengthFraction <= 36){fifthD = 5;}
                else if (lengthFraction <= 48){fifthD = 6;}
                else if (lengthFraction <= 60){fifthD = 7;}
                else if (lengthFraction <= 72){fifthD = 8;}
                else if (lengthFraction <= 84){fifthD = 9;}
                else if (lengthFraction <= 96){fifthD = 'A';}
                else if (lengthFraction <= 108){fifthD = 'B';}
                else if (lengthFraction <= 120){fifthD = 'C';}
                else if (lengthFraction <= 132){fifthD = 'D';}
                else if (lengthFraction <= 144){fifthD = 'E';}
                else if (lengthFraction <= 156){fifthD = 'F';}
                else if (lengthFraction <= 168){fifthD = 'G';}
                else if (lengthFraction > 168){fifthD = 'H';}
            }
            else if (fd.field('TypeOfPart').value == 'Laser Cut'){
                secondD = '7';
                fd.field('BGSR').value = false;
                fd.field('BGSR').disabled = true;
            }
            costCalc();
        }
        else if (fd.container('Tabs').tabs[1].disabled == false){
            secondD = '1'
            fd.field('FCSample').disabled = false;
            fd.field('Unit').disabled = false;
            fd.field('Unit').value = 'ea';
            if (fd.field('Part').value == 'Gearbox / Stand'){thirdD = '1';}
            else if (fd.field('Part').value == 'Worm Gear'){thirdD = '2';}
            else if (fd.field('Part').value == 'Mandrel Star / Expander'){thirdD = '3';}
            
            if (fd.field('MachineType').value == 'ST 1 1/2"'){fourthD = '1';}
            else if (fd.field('MachineType').value == 'ST 2"'){fourthD = '2';}
            else if (fd.field('MachineType').value == 'SUB'){fourthD = '3';}
            else if (fd.field('MachineType').value == 'Uncoiler'){fourthD = '4';}
        }
        else if (fd.container('Tabs').tabs[2].disabled == false){
            secondD = '3';
            fd.field('Unit').value = 'in';
            fd.field('FCSample').disabled = false;
            if (fd.field('ShapeSB').value == 'Round'){thirdD = '1';}
            else if (fd.field('ShapeSB').value == 'Hexagon'){thirdD = '2';}
            else if (fd.field('ShapeSB').value == 'Rectangle'){thirdD = '4';}
            
            if (fd.field('ThickDia').value == '1/4" - 2"'){fourthD = '1';}
            else if (fd.field('ThickDia').value == '2.1" - 4"'){fourthD = '2';}
            else if (fd.field('ThickDia').value == '4.1" - 6"'){fourthD = '3';}
            else if (fd.field('ThickDia').value == '6.1" - 8"'){fourthD = '4';}
            else if (fd.field('ThickDia').value == '8.1" - 12"'){fourthD = '5';}
            else if (fd.field('ThickDia').value == 'Greater than 12"'){fourthD = '6';}
            
            if (fd.field('WidthDia').value == '1/4" - 2"'){fifthD = '1';}
            else if (fd.field('WidthDia').value == '2.1" - 4"'){fifthD = '2';}
            else if (fd.field('WidthDia').value == '4.1" - 6"'){fifthD = '3';}
            else if (fd.field('WidthDia').value == '6.1" - 8"'){fifthD = '4';}
            else if (fd.field('WidthDia').value == '8.1" - 12"'){fifthD = '5';}
            else if (fd.field('WidthDia').value == 'Greater than 12"'){fifthD = '6';}
            
            if (fd.field('Material').value == 'Aluminum'){sixthD = '1';}
            else if (fd.field('Material').value == 'Brass'){sixthD = '2';}
            else if (fd.field('Material').value == 'Bronze'){sixthD = '3';}
            else if (fd.field('Material').value == 'Cast Iron'){sixthD = '4';}
            else if (fd.field('Material').value == 'HRS/1045'){sixthD = '5';}
            else if (fd.field('Material').value == '4140/4340/2312'){sixthD = '6';}
            else if (fd.field('Material').value == '52100'){sixthD = '7';}
            else if (fd.field('Material').value == 'CRS'){sixthD = '8';}
            else if (fd.field('Material').value == 'StressProof'){sixthD = '9';}
            else if (fd.field('Material').value == 'D2/52M'){sixthD = 'A';}
            else if (fd.field('Material').value == 'O1'){sixthD = 'B';}
            else if (fd.field('Material').value == 'M2/A2'){sixthD = 'C';}
            else if (fd.field('Material').value == 'Urethane'){sixthD = 'D';}
            else if (fd.field('Material').value == 'Ground Shaft'){sixthD = 'E';}
            else if (fd.field('Material').value == 'Threaded Rod'){sixthD = 'F';}
            else if (fd.field('Material').value == 'Screw Stock'){sixthD = 'G';}
            else if (fd.field('Material').value == 'Miscellaneous'){sixthD = 'Z';}
        }
        else if (fd.container('Tabs').tabs[3].disabled == false){
            secondD = '4';
            fd.field('Unit').value = 'in';
            fd.field('FCSample').disabled = false;
            if (fd.field('ShapeSS').value == 'Angle'){thirdD = '1';}
            else if (fd.field('ShapeSS').value == 'U Channel'){thirdD = '2';}
            else if (fd.field('ShapeSS').value == 'I Beam'){thirdD = '3';}
            else if (fd.field('ShapeSS').value == 'H Beam'){thirdD = '4';}
            else if (fd.field('ShapeSS').value == 'Miscellaneous'){thirdD = 'Z';}
            
            if (fd.field('MaterialSS').value == 'HRS'){fourthD = '1';}
            else if (fd.field('MaterialSS').value == 'Aluminum'){fourthD = '2';}
            else if (fd.field('MaterialSS').value == 'Miscellaneous'){fourthD = 'Z';}
        }
        else if (fd.container('Tabs').tabs[4].disabled == false){
            secondD = '5';
            fd.field('Unit').value = 'in';
            fd.field('FCSample').disabled = false;
            if (fd.field('ShapeT').value == 'Round Tube'){thirdD = '1';}
            else if (fd.field('ShapeT').value == 'Rectangular Tube'){thirdD = '2';}
            else if (fd.field('ShapeT').value == 'Square Tube'){thirdD = '3';}
            
            if (fd.field('MaterialT').value == 'Mechanical Tubing, Black Pipe, CDMT'){fourthD = '1';}
            else if (fd.field('MaterialT').value == 'Bronze'){fourthD = '2';}
            else if (fd.field('MaterialT').value == 'HRS'){fourthD = '3';}
            else if (fd.field('MaterialT').value == '52100'){fourthD = '4';}
            else if (fd.field('MaterialT').value == '8620'){fourthD = '5';}
            else if (fd.field('MaterialT').value == '4140'){fourthD = '6';}
            else if (fd.field('MaterialT').value == 'Aluminum'){fourthD = '7';}
            else if (fd.field('MaterialT').value == 'Miscellaneous'){fourthD = 'Z';}
        } 
        else if (fd.container('Tabs').tabs[5].disabled == false){
            secondD = '6';
            fd.field('Unit').disabled = false;
            fd.field('Unit').value = 'ea';
            fd.field('FCSample').disabled = false;
            if (fd.field('Type').value == 'Solid Sheet'){thirdD = '1';}
            else if (fd.field('Type').value == 'Expanded Metal'){thirdD = '2';}
            else if (fd.field('Type').value == 'Shim Stock'){thirdD = '3';}
            else if (fd.field('Type').value == 'Perforated'){thirdD = '4';}
            
            if (fd.field('MaterialSH').value == 'Steel'){fourthD = '1';}
            else if (fd.field('MaterialSH').value == 'Aluminum'){fourthD = '2';}
            else if (fd.field('MaterialSH').value == 'Miscellaneous'){fourthD = 'Z';}
        }
        //fills comm code field in form
        fd.field('CommCode').value = firstD+secondD+thirdD+fourthD+fifthD+sixthD;
    }
    
    //calculates the cost of flame cuts
    function costCalc() {
        
        fractionCheck();
        
        cost = (thickFraction + widthFraction + lengthFraction)*0.2836;
        cost = Number(Math.round(cost+'e2')+'e-2');
        
        fd.field('Cost').value = cost;
    }
    
    //updates the form with the most current information
    function update(){
        emailConvert();
        generateSample();
        costCalc();
        tabCheck();
        numberTypeCheck();
    }
    
    //converts name to email
    function emailConvert(){
        var fullName = fd.field('Name').value;
        var firstLetter, lastName, emailName;
        
        firstLetter = fullName[0];
        lastName = fullName.slice(fullName.indexOf(' ')+1,fullName.length);
        emailName = (firstLetter+lastName+'@samco-machinery.com').toLowerCase();
        
        fd.field('Email').value = emailName;
    }
    
    //checks what tabs need to active
    function tabCheck(){
       typeOfPart = fd.field('TypeOfPart').value;
       if (typeOfPart == 'Flame Cut'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[0].disabled = false;
           fd.container('Tabs').setTab(0);
       } 
       else if (typeOfPart == 'Laser Cut'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[0].disabled = false;
           fd.container('Tabs').setTab(0);
       }
       else if (typeOfPart == 'Castings'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[1].disabled = false;
           fd.container('Tabs').setTab(1);
       }
       else if (typeOfPart == 'Solid Bar'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[2].disabled = false;
           fd.container('Tabs').setTab(2);
       }
       else if (typeOfPart == 'Solid Structural'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[3].disabled = false;
           fd.container('Tabs').setTab(3);
       }
       else if (typeOfPart == 'Tubing'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[4].disabled = false;
           fd.container('Tabs').setTab(4);
       }
       else if (typeOfPart == 'Sheet'){
           disableAllTabs();
           fd.container('Tabs').hidden = false;
           fd.container('Tabs').tabs[5].disabled = false;
           fd.container('Tabs').setTab(5);
       }
    }
    
    //disables and hides tabs for r numbers
    function disableAllTabs(){
        fd.field('CommCode').disabled = true;
        fd.field('PurchasedPart').disabled = true;
        fd.field('PurchasedPart').hidden = true;
        fd.field('SubType').disabled = true;
        fd.field('SubType').hidden = true;
        fd.field('TypeF').disabled = true;
        fd.field('TypeF').hidden = true;
        fd.field('Diameter').disabled = true;
        fd.field('Diameter').hidden = true;
        fd.field('Thread').disabled = true;
        fd.field('Thread').hidden = true;
        fd.field('LengthF').disabled = true;
        fd.field('LengthF').hidden = true;
        fd.field('LenFraction').disabled = true;
        fd.field('LenFraction').hidden = true;
        fd.field('DiaFraction').disabled = true;
        fd.field('DiaFraction').hidden = true;
        fd.container('Tabs').hidden = true;
        fd.container('Tabs').tabs[0].disabled = true;
        fd.container('Tabs').tabs[1].disabled = true;
        fd.container('Tabs').tabs[2].disabled = true;
        fd.container('Tabs').tabs[3].disabled = true;
        fd.container('Tabs').tabs[4].disabled = true;
        fd.container('Tabs').tabs[5].disabled = true;
    }
    
    //disables and hides fields related to manufacturers
    function disableDefaults(){
        fd.control('Defaults').hidden = true;
        fd.field('Manufacturer').hidden = true;
        fd.field('MFGPartID').hidden = true;
        fd.control('Defaults').disabled = true;
        fd.field('Manufacturer').disabled = true;
        fd.field('MFGPartID').disabled = true;
        fd.field('Cost').disabled = true;
        fd.field('CommCode').disabled = true;
        fd.field('FCSample').disabled = true;
        fd.field('Cost').disabled = true;
        fd.field('Email').disabled = true;
        fd.field('Unit').disabled = true;
        fd.field('Manufacturer').field = '';
        fd.field('MFGPartID').field = '';
    }
    
    //enables and reveals fields realted to manufacturers
    function enableDefaults(){
        fd.control('Defaults').hidden = false;
        fd.field('Manufacturer').hidden = false;
        fd.field('MFGPartID').hidden = false;
        fd.control('Defaults').disabled = false;
        fd.field('Manufacturer').disabled = false;
        fd.field('MFGPartID').disabled = false;
    }
    
    //checking if any of the fields change
    fd.field('Thickness').$on('change', update);
    fd.field('ThicknessNum').$on('change', update);
    fd.field('ThicknessDen').$on('change', update);
    fd.field('Width').$on('change', update);
    fd.field('WidthNum').$on('change', update);
    fd.field('WidthDen').$on('change', update);
    fd.field('Length').$on('change', update);
    fd.field('LengthNum').$on('change', update);
    fd.field('LengthDen').$on('change', update);
    fd.field('BGSR').$on('change',update);
    fd.field('Name').$on('change', update);
    fd.field('TypeOfPart').$on('change',update);
    fd.field('Part').$on('change',update);
    fd.field('MachineType').$on('change',update);
    fd.field('ShapeSB').$on('change',update);
    fd.field('Material').$on('change',update);
    fd.field('ThickDia').$on('change',update);
    fd.field('WidthDia').$on('change',update);
    fd.field('ShapeSS').$on('change',update);
    fd.field('MaterialSS').$on('change',update);
    fd.field('ShapeT').$on('change',update);
    fd.field('MaterialT').$on('change',update);
    fd.field('Type').$on('change',update);
    fd.field('MaterialSH').$on('change',update);
    fd.field('NumberType').$on('change',update);
    fd.field('PurchasedPart').$on('change',update);
    fd.field('SubType').$on('change',update);
    //fd.field('TypeF').$on('change',update);
    fd.field('Diameter').$on('change',update);
    fd.field('DiaFraction').$on('change',update);
    fd.field('LengthF').$on('change',update);
    fd.field('LenFraction').$on('change',update);
    fd.field('Thread').$on('change',update);
    update();
});


/*
// ========================================================
//  EXAMPLE 2: The code is executed before saving the form
// ========================================================
fd.beforeSave(function () {

    // Prevent saving if StartDate is greater than EndDate
    if (fd.field('StartDate').value > fd.field('EndDate').value) {
        throw Error('Start Date must not be greater than End Date.');
    }
});
*/

/*
// =============================================================
//  EXAMPLE 3: The code is executed right after saving the form
// =============================================================
fd.saved(function (result) {

    // Forward users to a custom Thank You page with a parameter
    var email = fd.field('Email').value;
});
*/