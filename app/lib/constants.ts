


export const D = {
  bg:"#0F172A", card:"#111827", surface:"#1E293B", surfaceHover:"#243447",
  border:"rgba(255,255,255,0.07)", borderSoft:"rgba(255,255,255,0.04)",
  gold:"#D4A373", goldDim:"rgba(212,163,115,0.15)", goldBorder:"rgba(212,163,115,0.35)",
  green:"#7FA88A", greenDim:"rgba(127,168,138,0.16)",
  text:"#F8FAFC", sub:"#B4C0D0", muted:"#8593A6",
  success:"#4ADE80", successDim:"rgba(74,222,128,0.14)", successBorder:"rgba(74,222,128,0.3)",
  warning:"#FBBF24", warningDim:"rgba(251,191,36,0.14)", warningBorder:"rgba(251,191,36,0.3)",
  danger:"#F87171", dangerDim:"rgba(248,113,113,0.14)", dangerBorder:"rgba(248,113,113,0.3)",
  blue:"#60A5FA", blueDim:"rgba(96,165,250,0.14)", blueBorder:"rgba(96,165,250,0.3)",
};

export const F = "'Inter',system-ui,-apple-system,sans-serif";

export const ROOMS = [
  ...Array.from({length:8},(_,i)=>({id:`FR-0${i+1}`,type:"Family"})),
  ...Array.from({length:8},(_,i)=>({id:`CR-0${i+1}`,type:"Couple"})),
];

export const HOLIDAYS = [
  {date:"2026-01-01",name:"New Year's Day"},
  {date:"2026-01-14",name:"Makar Sankranti"},
  {date:"2026-01-26",name:"Republic Day"},
  {date:"2026-02-26",name:"Maha Shivaratri"},
  {date:"2026-03-20",name:"Holi"},
  {date:"2026-04-02",name:"Ram Navami"},
  {date:"2026-04-03",name:"Good Friday"},
  {date:"2026-04-14",name:"Ugadi"},
  {date:"2026-04-21",name:"Eid ul-Fitr"},
  {date:"2026-05-01",name:"Karnataka Rajyotsava"},
  {date:"2026-06-28",name:"Eid ul-Adha"},
  {date:"2026-08-15",name:"Independence Day"},
  {date:"2026-08-26",name:"Janmashtami"},
  {date:"2026-09-17",name:"Ganesh Chaturthi"},
  {date:"2026-10-02",name:"Gandhi Jayanti"},
  {date:"2026-10-20",name:"Dussehra"},
  {date:"2026-10-29",name:"Diwali"},
  {date:"2026-11-01",name:"Kannada Rajyotsava"},
  {date:"2026-11-15",name:"Guru Nanak Jayanti"},
  {date:"2026-12-25",name:"Christmas"},
];

export const DEFAULT_USERS = [
  {username:"admin",     password:"rivora@2026", role:"admin",  name:"Admin (Owner)"},
  {username:"agnish",    password:"staff@123",   role:"staff",  name:"Agnish"},
  {username:"deekshith", password:"staff@123",   role:"staff",  name:"Deekshith"},
  {username:"mahindra",  password:"staff@123",   role:"staff",  name:"Mahindra"},
  {username:"viewer",    password:"view@123",    role:"viewer", name:"View Only"},
];

export const DEFAULT_SETTINGS = {
  advancePct: 30,
  familyRate: 2000,
  coupleRate: 2200,
  checkInTime: "12:30 PM",
  checkOutTime: "11:30 AM",
  bankName: "Karnataka Bank",
  accNo: "3862500100157001",
  accHolder: "Agnisha K S",
  ifsc: "KARB0000386",
  upi: "81977 27572",
  resortName: "RIVORA COORG",
  staffList: ["Agnish","Deekshith","Mahindra"],
  packages: [
    "Room","Breakfast","Dinner","Free Wi-Fi",
    "Fire Camp with Music","Swimming Pool Access","River Walk","Estate Walk",
  ],
  customPrices: {} as Record<string,number>,
  gstin: "",
};