import React, { useState, type MouseEvent } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Popover from "@mui/material/Popover";




export type InputType = "string"|"text"|"date"|"hours"|"idVehicule";
type InputFormSinistreProps = {
    value?: string,
    onchange?: (value: string)=>void,
    title: string,
    placeholder: string,
    type?: InputType,
    iconUrl?: string,
    dateValue?: Date|null,
    onChangeDate?: (value: Date|null)=>void
}

const InputFormSinistre = ({value, onchange, placeholder, type, title, iconUrl, onChangeDate, dateValue}: InputFormSinistreProps) => {

 
  const [open, setOpen] = useState(false);
  const today = new Date();
  const handleDateChange = (date: Date|null) => {
    if(onChangeDate)
        onChangeDate(date);
    setOpen(false);       
  };


  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openEl = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLDivElement>)=>{
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTimeChange = (value: Date | null) => {
    if (value && onChangeDate) {
      onChangeDate(value);
    }
  };

  return (
    <div className={`${'mt-5'}`}>
        <h1 className='txt-lg font-bold text-lg'>{title}</h1>

        {type == "string" &&
            <div className='border-2 border-gray-500 rounded-lg py-2'>
                    <input type='text' 
                        className='placeholder-gray-400 pl-3 outline-none w-full'
                        placeholder={placeholder}   
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                            if(onchange)
                                onchange(e.target.value)
                        }}/>
                </div>}
        

        {type == "idVehicule" &&
                <div className='border-2 border-gray-500 rounded-lg py-2'>
                    <input type='text' 
                        readOnly
                        className='placeholder-gray-400 pl-3 outline-none w-full'
                        placeholder={placeholder}   
                        value={value}
                    />
                </div>
        }
        {type == "text" &&  
            <div className='border-2 border-gray-500 rounded-lg py-2 h-30'>
                <textarea 
                    placeholder={placeholder} 
                    className='w-full h-full pl-3 outline-none' 
                    value={value} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {
                        if(onchange)
                            onchange(e.target.value)
                        }}
                    />
            </div>
        }
        
        {type == "date" &&
            <div>
                <div className='border-2 border-gray-500 rounded-lg py-2 flex pr-5 items-center'>
                    <input 
                        readOnly
                        onClick={() => setOpen(true)}
                        type='text' 
                        className='placeholder-gray-400 pl-3 outline-none flex-1'
                        placeholder={placeholder}   
                        value={dateValue?.toLocaleDateString("fr-FR")}

                    />
                    
                    <img src={iconUrl} className='w-5 h-5' onClick={() => setOpen(true)}/>
                    <DatePicker
                        maxDate={today}
                        selected={dateValue}
                        onChange={handleDateChange}
                        open={open}
                        onClickOutside={() => setOpen(false)}   
                        className="hidden"                      
                        calendarClassName="border rounded-lg"
                    /> 
                </div>
                
            </div>}
            {
            type == "hours" &&
            <div>
                <div className='border-2 border-gray-500 rounded-lg py-2 flex pr-5 items-center' onClick={handleClick}>
                        <input 
                            readOnly
                            onClick={handleClick}
                            type='text' 
                            className='placeholder-gray-400 pl-3 outline-none flex-1'
                            placeholder={placeholder}   
                            value={dateValue != null?dateValue?.getHours() + ":" + dateValue?.getMinutes():""}

                        />
            
                            
                        <img src={iconUrl} className='w-5 h-5'/>

                    </div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        
                        <div>
                            <Popover
                                open={openEl}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <TimePicker
                                        value={dateValue}
                                        onChange={handleTimeChange}
                                    />
                                    <div className='inline-block bg-gray-500 px-2 py-3 text-white font-semibold' onClick={handleClose}>
                                        Fermer
                                    </div>
                                </div>
                        
                            </Popover>
                        </div>
                    </LocalizationProvider>
                </div>}

            
        
    </div>
  )
}


{/* <div className='border-2 border-gray-500 rounded-lg py-2'>
                    <input type='text' 
                        className='placeholder-gray-400 pl-3 outline-none w-full'
                        placeholder={placeholder}   
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                            if(onchange)
                                onchange(e.target.value)
                        }}/>
                </div> */}

export default InputFormSinistre





// return (
//     <div className={`${'mt-5'}`}>
//         <h1 className='txt-lg font-bold text-lg'>{title}</h1>

        

//         {
//         iconUrl == undefined ?
//             type == "idVehicule"?
//                 <div className='border-2 border-gray-500 rounded-lg py-2'>
//                     <input type='text' 
//                         readOnly
//                         className='placeholder-gray-400 pl-3 outline-none w-full'
//                         placeholder={placeholder}   
//                         value={value}
//                     />
//                 </div>
//         :
//                 <div className='border-2 border-gray-500 rounded-lg py-2 h-30'>
//                     <textarea 
//                         placeholder={placeholder} 
//                         className='w-full h-full pl-3 outline-none' 
//                         value={value} 
//                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {
//                             if(onchange)
//                                 onchange(e.target.value)
//                         }}
//                     />
//                 </div>
        
//         : type == "date" ? 
//             <div>
//                 <div className='border-2 border-gray-500 rounded-lg py-2 flex pr-5 items-center'>
//                     <input 
//                         readOnly
//                         onClick={() => setOpen(true)}
//                         type='text' 
//                         className='placeholder-gray-400 pl-3 outline-none flex-1'
//                         placeholder={placeholder}   
//                         value={dateValue?.toLocaleDateString("fr-FR")}

//                     />
                    
//                     <img src={iconUrl} className='w-5 h-5' onClick={() => setOpen(true)}/>
//                     <DatePicker
//                         maxDate={today}
//                         selected={dateValue}
//                         onChange={handleDateChange}
//                         open={open}
//                         onClickOutside={() => setOpen(false)}   
//                         className="hidden"                      
//                         calendarClassName="border rounded-lg"
//                     /> 
//                 </div>
                
//             </div>
//         :   <div>
//                 <div className='border-2 border-gray-500 rounded-lg py-2 flex pr-5 items-center' onClick={handleClick}>
//                         <input 
//                             readOnly
//                             onClick={handleClick}
//                             type='text' 
//                             className='placeholder-gray-400 pl-3 outline-none flex-1'
//                             placeholder={placeholder}   
//                             value={dateValue != null?dateValue?.getHours() + ":" + dateValue?.getMinutes():""}

//                         />
            
                            
//                         <img src={iconUrl} className='w-5 h-5'/>

//                     </div>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                        
//                         <div>
//                             <Popover
//                                 open={openEl}
//                                 anchorEl={anchorEl}
//                                 onClose={handleClose}
//                                 anchorOrigin={{
//                                     vertical: "bottom",
//                                     horizontal: "left",
//                                 }}
//                             >
//                                 <div style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                                     <TimePicker
//                                         value={dateValue}
//                                         onChange={handleTimeChange}
//                                     />
//                                     <div className='inline-block bg-gray-500 px-2 py-3 text-white font-semibold' onClick={handleClose}>
//                                         Fermer
//                                     </div>
//                                 </div>
                        
//                             </Popover>
//                         </div>
//                     </LocalizationProvider>
//                 </div>

            
//         }
//     </div>
//   )
// }