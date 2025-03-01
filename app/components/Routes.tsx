"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Modal from "./modal";

interface Route {
  type: string;
  fare?: number;
  number: string;
  details: string;
  stops: string[];
}
// Route type to image mapping
const iconMapping: Record<string, string> = {
  "brts": "/images/peoplebus.png",
  "people-bus": "/images/peoplebus.png",
  "local-bus": "/images/bus.png",
  "chinchi": "/images/tuk-tuk.png",
};

// Sample routes
const routes = [

{ type: "brts",fare:50, number: "Green line BRT", details: "Abdullah chock to numaish", stops: ["Abdullah chock", "KDA Surjani", "Karimi chowrangi","4k chowrangi","2minute chowrangi","Road-2400 Aisha complex","Power house chowrangi","Road 4200 Saleem center","Up More","Nagan Chowrangi","Erum shopping center","Sakhi hasan chowrangi","Jummah bazaar(bhayani center)","5 star chowrangi","HYDERI","BOARD OFFICE","ANNU BHAI PARK","ENQUIRY OFFICE","NAZIMABAD no.1","SANITARY MARKET(GULBAHAR)","LASBELA","PATEL PARA(guru mandir)","NUMAISH"] },
{ type: "brts", number: "Orange line BRT", details: "board office to nadra office orangi town", stops: ["BOARD OFFICE", "ABDULLAH COLLEGE", "POLICE STATION - (orangi town)","NADRA CENTER - (orangi town)"] },



{ type: "people-bus", number: "R-1",fare: 80,                details: "Route from Model colony to Dock yard ", stops: ["MODEL COLONY", "SECURITY PRESS", "MALIR HALT","WIRELESS GATE BUS STOP","CHOTA GATE","SHAH FAISAL COLONY GATE","NATA KHAN","DRIGH ROAD","PAF BASE FAISAL","KARSAZ","PAF MUSEUM","AWAMI MARKAZ","BALOCH COLONY","FINE HOUSE","LAAL KOTHI","NURSERY","FTC BUILDING","AISHA BAWANI COLLEGE","REGENT PLAZA (SIUT)","ARTS COUNCIL OF PAKISTAN, KARACHI","SHAHEEN COMPLEX","CITY RAILWAY","I.I. CHUNDRIGAR","TOWER","DOCKYARD"] },
{ type: "people-bus", number: "R-2",fare: 80,                details: "Route from  Power House to Indus hospital -Korangi", stops: ["POWER HOUSE CHOWRANGI","ROAD 4200 SALEEM CENTER","UP MORE","NAGAN CHOWRANGI","SHAFIQ MOR","SOHRAB GOTH","SAGHEER GATE - FB AREA","LUCKY ONE MALL","IMTIAZ MEGA STORE (GULSHAN)","GULSHAN CHOWRANGI","NIPA CHOWRANGI","ALADIN PARK","JOHAR MOR","MILLINIUM MALL","ARMY PUBLIC SCHOOL","DRIGH ROAD","SHAH FAOSAL COLONY 2","SINGER CHOWRANGI","KHADDI STOP","SECTOR 36 LANDHI","SECTOR 35 LANDHI","SECTOR 33 LANDHI","SECTOR 32 LANDHI","GULZAR COLONY","NASIR JUMP","DISTRICT COURT-KORANGI","INDUS HOSPITAL-KORANGI"] },
{ type: "people-bus", number: "R-3",fare: 80,                details: "Route from POWER HOUSE to NASIR JUMP", stops: ["CSD SUPER MARKET", "POWER HOUSE CHOWRANGI", "ROAD 4200-SALEEM CENTER","UP MOR","NAGAN CHOWRANGI","ERUM SHOPPING","SAKHI HASANCHOANGI","JUMMAH BAZAAR","5 STAR CHORANGI","HYDERI MARKET","KDA CHOWRANGI","BOARD OFFICE","NAZIMABAD NO 7","NAZIMABAD NO 6","NAZIMABAD PETROL PUMP","LIAQUATABAD NO 10-LALUKHET","ESSA NAGRI","HASAN SQUARE","NATIONAL STADIUM","MARITIME MUSEUM","KDA SCHEME 1","PAF MUSEUM","AWAMI MARKAZ","BALOCH COLONY","FINE HOUSE","LAAL KOTHI","NURSERY", "KALA PUL","NMC HOSPITAL","SUNSET BOULEVARD","KPT INTERCHANGE","IMTIAZ STORE KPT INTER CHANGE","BROOKES CHOWRANGI","SOORTY FACTORY","SHAAN CHOWRANGI","NASIR JUMP"] },
{ type: "people-bus", number: "R-4",fare: 80,                details: "Route from Power House to Keamari ", stops: ["Power House", "UP Mor", "Nagan Chowrangi", "Shafiq Mor", "Sohrab Goth", "Water Pump", "Ayesha Manzil", "Karimabad" , "Liaqautabad 10", "Laloo Khait", "Teen Hati", "Jehangir Road", "Numaish", "Mobile Market", "Urdu Bazar", "Civil Hospital", "City Court", "Light House", "Bolton Market", "Tower"," Keamari"] },
{ type: "people-bus", number: "R-8",fare: 80,                details: "Route from Yousuf Goth to Tower", stops: ["Yousuf Goth"," Naval Colony", "Baldia", "Sher Shah", "Gulbai", "Agra Taj Colony", "Daryabad", "Jinnah Brige", "Tower"] },
{ type: "people-bus", number: "R-9",fare: 80,                details: "Route from Gulshan-e-Hadeed to tower", stops: ["Gulsahan e Hadeed", "Salah Uddin Ayubi Road", "Allah Wali Chowrangi", "National Highway 5", "Steel Mill More", "Port Bin Qasim More", "Razzakabad", "Abdullah Goth", "Chowkundi More", "Fast University", "Bhains Colony More", "Manzil Pump", "Quaidabad", "Murghi Khana", "Prince Aly Boys School", "Nadra Center Malir", "Malir Session Court", "Malir 15", "Kalaboard", "Malir Halt", "Colony Gate", "Nata Khan Bridge", "Drigh Road Station", "PAF Base Faisal", "Laal Kothi", "Karsaz", "Nursery", "FTC", "Regent Plaza", "Metropole", "Fawwara Chowk", "Arts Council", "Shaheen Complex", "I.I.Chundrigar" ," Tower"] },
{ type: "people-bus", number: "R-10",fare: 80,               details: "Route from Numaish to Ibrahim Hyderi", stops: ["Numaish Chowrangi", "Mobile Market", "Metropole", "Frere Hall", "Teen Talwar", "Do Talwar","Abdullah Shah Ghazi", "Dolmen Mall", "Clock Tower DHA", "26 Street", "Masjid-e-Ayesha", "Rahat Park"," KPT Inter change", "Korangi Crossing"," CBM University"," Parco", "Ibrahim Hyderi"] },
{ type: "people-bus", number: "R-11",fare: 80,               details: "Route from Miran nakka to Shireen Jinnah University", stops: ["Miran Nakka", "Gulistan Colony", "Bihar Colony", "Agra Taj", "Daryabad", "Jinnah Brige", "Bahria Complex", "M.T.Khan Road", "PICD", "Submarine Chowk", "Bahria Complex 3", "Khadda Market", "Abdullah Shah Ghazi", "Bilawal Chowrangi", "Ziauddin Hospital", "Shireen Jinnah Colony"] },
{ type: "people-bus", number: "R-12",fare: 80,               details: "Route from Naddi kinara to Lucky star", stops: ["Naddi Kinara"," Khokhrapar"," Saudabad Chowrangi"," RCD Ground", "Kalaboard"," Malir 15", "Malir Mandir", "Malir Session  Court", "Murghi Khana", "Quaidabad", "Dawood Chowrangi"," Babar Market", "Landhi Road", "Nasir Jump", "Indus Hospital", "Korangi Crossing", "Qayyumabad", "Defence Mor", "National Medical Center", "Gora Qabristan", "FTC", "Jutt Land", "Lines Area"," Army Public School", "Lucky Star Saddar"] },
{ type: "people-bus", number: "R-13",fare: 80,               details: "Route from Hawksway to Tower", stops: ["Hawksbay", "Mauripur", "Gulbai"," Agra Taj"," Daryabad"," Jinnah Brige"," Tower" ] },
{ type: "people-bus", number: "EV-1",fare: 80,               details: "Route from Malir to Dolmen mall Clifton", stops: ["CMH Malir Cantt", "Tank Chowk", "Model Colony Mor", "Jinnah Ave", "Airport"," Colony Gate"," Nata Khan Bridge"," Drigh Road Station", "PAF Base Faisal", "Laal Kothi", "Karsaz", "Nursery", "FTC", "Korangi Road", "DHA Phase 1", "Masjid e Ayesha", "Clock Tower DHA", "Dolmen Mall Clifton"] },
{ type: "people-bus", number: "EV-2",fare: 80,               details: "Route from Bahria Town to Malir Halt", stops: ["Bahria Town", "Dumba Goth"," Toll Plaza"," Baqai University"," Malir Cantt Gate 5", "Malir Cantt Gate 6", "Tank Chowk"," Model Mor", "Jinnah Ave", "Malir Halt"] },
{ type: "people-bus", number: "EV-3",fare: 80,               details: "Route from Malir Cantt. checkpost 5 to numaish", stops: ["Malir Cantt Check Post 5", "Rim Jhim Tower"," Safoora Chowrangi"," Mausamiyat Chowrangi"," Kamran Chowrangi", "Darul Sehat Hospital", "Johar Chowrangi", "Johar Mor", "Millennium Mall"," Dalmia Road"," Bahria University"," National Stadium"," Aga Khan Hospital"," Liaquat National Hospital", "PIB Colony"," Jail Chowrangi", "Dawood Engineering University"," Islamia College"," People Secretariat Chowrangi", "Numaish"] },
{ type: "people-bus", number: "EV-4",fare: 80,               details: "Route from Bahria town to Ayesha Manzil", stops: ["Bahria Town", "Dumba Goth"," M9 Toll Plaza", "Jamali Pull"," New Sabzi Mandi"," Al Asif", "Sohrab Goth"," Water Pump"," Ayesha Manzil"] },
{ type: "people-bus", number: "EV-5",fare: 80,               details: "Route from DHA city to Sohrab Goth", stops: ["DHA City"," Bahria Town", "Dumba Goth", "M9 Toll Plaza", "Jamali Pull"," New Sabzi Mandi", "Al Asif", "Sohrab Goth"] },

{ type: "local-bus", number: "11-C",fare: 20,                details: "City Route", stops: ["AKHTAR COLONY", "AZAM BASTI--AZAM TOWN", "KALA PUL","JPMC(JINNAH HOSPITAL)","LUCKY STAR(SADDAR)","SADDAR","PARKING PLAZA-SADDAR","LINES AREA","ISLAMIA COLLEGE","JAIL CHOWRANGI","NEW TOWN","OLD SABZI MANDI","HASSAN SQUARE","EXPO CENTER","CIVIC CENTER","SIR SYED UNIVERSITY","NIPA CHOWRANGI","SAFARI PARK","METRO SAFARI STORE","UNIVERSITY ROAD","NED UNIVERSITY","KARACHI UNIVERSITY","MAUSAMIYAT","SAFOORA","DOW OJHA CAMPUS"] },
{ type: "local-bus", number: "16",fare: 20,                  details: "City Route", stops: ["BHAINS COLONY MOR","MANZIL PUMP","QAIDABAD","MALIR 15", "KALABOARD","MALIR HALT","CHOTA GATE-SHAH FAISAL COLONY","SHAH FAISAL COLONY GATE","NATA KHAN","DRIGH ROAD","KARSAZ","BALOCH COLONY","LAL KOTHI","NURSERY","GORA QABRISTAN","SADDAR"] },
{ type: "local-bus", number: "19-D",fare: 20,                details: "City Route", stops: ["GIZRI","ZAMZAMA","NEELAM COLONY","ABDULLAH SHAH GHAZI","BILAWAL CHORANGI","SHIREEN JINNAH COLONY","ZIAUDDING UNIVERSITY -CLIFTON"] },
{ type: "local-bus", number: "20",fare: 20,                  details: "City Route", stops: ["ITTEHAD TOWN", "GULSHAN E GHAZI", "BALDIA 9","BALDIA 8","RUBY MOR","POLICE TRAINING CENTER SAEEDABAD","MACH MOR","BALDIA 4","BALDIA 3","BALDIA 2","RASHEEDABAD","GCT COLLEGE MOR","S.I.T.E POLICE STATION","METRO MANGHOPIR STORE","HABIB BANK CHOWRANGI","GOLIMAR OLD","REXER LINE","GARDEN","SEVENTH DAY ADVENTIST HOSPITAL","SADDAR","CANTT STATION","DO TALWAR","DRIVING LICENSE OFFICE -CLIFTON","ABDULLAH SHAH GHAZI","BILAWAL CHOWRANGI","ZIAUDDING HOSPITAL -CLIFTON","SHIREEN JINNAH COLONY"] },
{ type: "local-bus", number: "4-E",fare: 20,                 details: "City Route", stops: ["NOT FOUND"] },
{ type: "local-bus", number: "4-H",fare: 20,                 details: "City Route", stops: ["4K CHORANGI", "CANTT STATION"] },
{ type: "local-bus", number: "4-L",fare: 20,                 details: "City Route", stops: ["SOHRAB GOTH", "LASBELA", "RANCHORE LINE","ISLAMIA COLLEGE -NEW M.A JINNAG ROAD"] },
{ type: "local-bus", number: "4-Q",fare: 20,                 details: "City Route", stops: ["SOHRAB GOTH", "LASBELA", "RANCHORE LINE"] },
{ type: "local-bus", number: "51",fare: 20,                  details: "City Route", stops: ["NEW TOWN", "LIAQUAT NATIONAL HOSPITAL", "MALIR HALT"] },
{ type: "local-bus", number: "52",fare: 20,                  details: "City Route", stops: ["MALIR HALT","WIRELESS GATE","CHOTA GATE","STAR GATE","NATAKHAN","DRIGH ROAD","PAF FAISAL BASE","KARSAZ","PIR PAGARA BUS STOP","NATIONAL STADIUM","AGHA KHAN HOSPITAL","LIAQUAT NATIONAL HOSPITAL"] },
{ type: "local-bus", number: "55",fare: 20,                  details: "City Route", stops: ["MEMON GOTH -GADAP TOWN", "MALIR 15", "KALABOARD","MALIR HALT","WIRELESS GATE","CHOTA GATE","STAR GATE","NATAKHAN","DRIGH ROAD","PAF FAISAL BASE","KARSAZ","PIR PAGARA BUS STOP","NATIONAL STADIUM","AGHA KHAN HOSPITAL","LIAQUAT NATIONAL HOSPITAL","NEW TOWN","JAIL CHOWRANGI","PEOPLES SECRETARIAT","GURU MANDIR","LASBELA","SOLDIER BAZAAR","GARDEN","RANCHORE LINE","OLD HAJI CAMP -TIMBER MARKET","Lee MARKET"] },
{ type: "local-bus", number: "7-C",fare: 20,                 details: "City Route", stops: ["BUFFER ZONE", "DC CENTRAL OFFICE", "PEOPLES CHOWRANGI","KARACHI MEDICAL AND DENTAL COLLEGE (K.M.D.C)", "LANDI KOTAL CHORANGI ", "ZIAUDDIN HOSPITAL(NORTH NAZIMABAD)","MOOSA COLONY-GULBERG TOWN", "KARIMABAD", "LIAQUATABAD no. 10 -LALUKHET","DAAK KHANA-LIAQUATABAD","RIZVIA SOCEITY- NAZIMABAD NO 1","KHAMOOSH COLONY","BARABOARD","NAURAS CHOWRANGI -S.I.T.E KARACHI","HABIB BANK CHOWRANGI","HAROONABAD","SIEMENS CHOWRANGI","GHANI CHOWRANGI","SHERSHAH","SHAHEEN HOTEL-SHERSHAH","SHERSHAH KABARI MARKET","PANKHA HOTEL- SHERSHAH","LEE MARKET","KHAJOOR BAZAAR- LEE MARKET","SARAFA BAZAAR","KHARADAR","TOWER","DOCKYARD"] },
{ type: "local-bus", number: "7-STAR",fare: 20,              details: "City Route", stops: ["ORANGI 11", "ORANGI 5", "METRO CINEMA","BANARAS","HABIB BANK CHOWRANGI","NAZIMABAD PETROL PUMP","GHAREEBABAD","Liaqautabad no 10 -LALUKHET","ESSA NAGRI","HASSAN SQUARE","EXPO CENTERCIVIC CENTER","NATIONAL STADIUM","KARSAZ","PAF BASE FAISAL","DRIGH ROAD","NATA KHAN","STAR GATE","MALIR HALT","KALA BOARD","RCD GROUND","SAUDABAD CHOWRANGI","KHOKRAPAR"] },
{ type: "local-bus", number: "9C", fare: 20,                 details: "City Route", stops: ["MALIR HALT","WIRELESS GATE","CHOTA GATE","STAR GATE","NATAKHAN","DRIGH ROAD","PAF FAISAL BASE","KARSAZ","PAF MUSEUM","AWAMI MARKAZ","BALOCH COLONY","FINE HOUSE","LAAL KOTHI","NURSERY","FTC BUILDING","AISHA BAWANI COLLEGE","REGENT PLAZA (SIUT)","JPMC(JINNAH HOSPITAL)"] },
{ type: "local-bus", number: "A-25",fare: 20,                details: "City Route", stops: ["AHSANABAD","MAYMAR MOR","ABDULLAH GABOL GOTH","NEW SABZI MANDI","AL ASIF SQUARE","SOHRAB GOTH","WATER PUMP","AYESHA MANZIL","KARIMABAD","LIAQUATABAD No.10-LALUKHET","NAZIMABAD PETROL PUMP","NAZIMABAD No.1","HABIB BANK CHOWRANGI","METRO MANGHOPIR STORE","SALIKA","S.I.T.E POLICE STATION","LABOR SQUARE -METROVILLE S.I.T.E","GCT COLLEGE MOR","RASHEEDABAD","BALDIA 7 GRAVEYARD","BALDIA 19-D","RUBI MOR","POLICE TRAINING CENTER SAEEDABAD","MACH MOR","MURSHID HOSPITAL","NAVAL HOSPITAL","YOUSUF GOTH"] },
{ type: "local-bus", number: "A-3",fare: 20,                 details: "City Route", stops: ["MAYMAR MOR","AL ASIF SQUARE","ABU; HASAN ISPHANI ROAD","GULSHAN POLICE STATION","MASKAN CHOWRANGI","DISCO BAKERY","GULSHAN CHOWRANGI","NIPA CHOWRANGI","OLD SABZI MANDI","EXPO CENTER","HASAN SQUARE","ESSA NAGRI","GHAREEBABAD","LIAQUATABAD No.10 -LALUKHET","NAZIMABAD PETROL PUMP","HABIB BANK CHOWRANGI","SIEMENS CHOWRANI","S.I.T.E -JINNAH AVENUE Rd","GHANI CHOWRANGI","SHERSHAH","MEEZAN HEAD OFFICE","GULBAI","AGRA TAJ COLONY","IC BRIDGE","WEST WHARF ROAD","DOCKYARD"] },
{ type: "local-bus", number: "ABDULLAH",fare: 20,            details: "City Route", stops: ["SHERSHAH", "MEZAAN HEAD OFFICE", "GULBAI","AGRA TAJ COLONY","TOWER","US EMBASSY","BOAT BASIN","SUBMARINE CHOWK","PUNJAB CHOWRANGI","AKHTAR COLONY","KORANGI CROSSING ROAD","DEFENCE MOR","QUAIDABAD","QAYYUMABAD","MANZIL PUMP"] },
{ type: "local-bus", number: "AL-AZAD", fare: 20,            details: "City Route", stops: ["KARACHI MARRIOT HOTEL", "SAFOORA",] },
{ type: "local-bus", number: "AL-KHAIR",fare: 20,            details: "City Route", stops: ["MUSHARRAF COLONY -KEAMARI", "NAVAL COLONY", "MACH MOR","SHERSHAH","SHERSHAH KABAR MARKET","PANKHA HOTEL","MIRAN NAKKA LYARI","LEE MARKET"] },
{ type: "local-bus", number: "BILAL", fare: 20,              details: "City Route", stops: ["ITTEHAD TOWN", "FAREED COLONY -ORANGI", "MOMINABAD -ORANGI","SHAHEEN COMPLEX","ORANGI 5","METRO CINEMA","BANARAS","HABIB BANK CHOWRANGI","NAZIMABAD NO 1","NAZIMABAD PETROL PUMP","LIAQUATABAD No 10 -LAUKHET","GHAREEBABAD","ESSA NAGRI","HASSAN SQUARE","NEW TOWN","JAIL CHOWRANGI","TARIQ ROAD","BAHADURABAD","SHAEED-E-MILLAT","BALOCH COLONY","GODAM CHOWRANGI","CHAMRA CHOWRANGI","VITA CHOWRANGI -KORANGI","BILAL CHOWRANGI","LUCKY STAR -SADDAR","SINGER CHOWRANGI","CM HOUSE -F-R SADDAR","DAWOOD CHOWRANGI","YUNUS CHOWRANGI","KARACHI GYMKHANA","MEHRAN HIGHWAY","LABOUR SQUARE -LANDHI TOWN","DAWOOD ROUND ABOUT"] },
{ type: "local-bus", number: "D-1", fare: 20,                details: "City Route", stops: ["SINDHI GOTH", "PIPRI GOTH", "RAZZAQABAD","BHAINS COLONY MOR","MANZIL PUMP","QUAIDABAD","MALIR COURT","MALIR 15","MALIR HALT","STAR GATE -SHA FAISAL COLONY","SHA FAISAL COLONY GATE","NATA KHAN","DRIGH ROAD","PAF BASE FAISAL","KARSAZ","PIR PAGARA BUS STOP","NATIONAL STADIUM","MASHRIQ CENTER","HASSAN SQUARE","EXPO CENTER","ESSA NAGRI","GHAREEBABAD","LIAQUATABAD No.10 -LALUKHET","NAZIMABAD PETROL PUMP","HABIB BANK CHOWRANGI","VALIKA","FRONTIER MOR METROVILLE","ORANGI 4","MOMINABAD -ORANGI TOWN","ABIDABAD"] },
{ type: "local-bus", number: "D-11", fare: 20,               details: "City Route", stops: ["ITTEHAD TOWN", "PAKORA CHOWK", "BALDIA 8","BALDIA 9","BISMILLAH CHOWK","JUNGLE SCHOOL (BALDIA)","BALDIA 19-D","BALDIA 7 GRAVEYARD","RASHEED ABAD","GCT COLLEGE MOR","GHANI CHORANGI","SIEMENS CHOWRANGI","HABIB BANK CHOWRANGI","LIAQUATABAD No.10 -LALUKHET","GHAREEBABAD","BALOCH HOTEL","ESSA NAGRI","EXPO CENTER","HASSAN SQUARE","CIVIC CENTER","MASHRIQ CENTER","NATIONAL STADIUM","PIR PAGARA BUS STOP","NURSERY","BALOCH COLONY","KARSAZ","PAF BASE FAISAL","DRIGH ROAD","NATA KHAN","SHAH FAISAL COLONY GATE","STAR GATE -SHAH FAISAL COLONY","CHOTA GATE - SHAH FAISAL COLONY","WIRELESS GATE BUS STOP","MALIR HALT","KALA BOARD","MALIR 15","MALIR COURT","QUAIDABAD","DAWOOD CHOWRANGI","FUTURE COLONY -LANDHI","MANSHERA COLONY","MURTUZA CHOWRANGI","BILAL CHOWRANGI","VITA CHOWRANGI -KORANGI","SHAN CHOWRANGI -KORANGI","BROOKES CHOWRANGI","GODAM CHOWRANGI","IMTIAZ STORE -KPT INTERCHANGE","QAYYUMABAD","SHARIFABAD -KORANGI"] },
{ type: "local-bus", number: "D-17", fare: 20,               details: "City Route", stops: ["QUAIDABAD", ] },
{ type: "local-bus", number: "D-7",  fare: 20,               details: "City Route", stops: ["NEW MUZAFFARABAD COLONY", "DAWOOD CHOWRANGI", "QUAIDABAD","MALIR COURT","MALIR 15","KALABOARD","MALIR HALT","STAR GATE -SHAHFAISAL COLONY","SHAH FAISAL COLONY GATE","NATA KHAN","DRIGH ROAD","MILENNIUM MALL","JOHAR MOR","ALADIN PARK","NIPA CHOWRANGI","GULSHAN CHOWRANGI","LUCKY ONE MALL","SOHRAB GOTH","AL ASIF SQUARE","PUNJAB ADDS -BUS STAND","JAMALI FLYOVER","KHADIM HUSSAIN SOLANGI GOTH","BADAR COMMERCIAL 26 STREET"] },
{ type: "local-bus", number: "D-8",  fare: 20,               details: "City Route", stops: ["NEW KARACHI INDUSTRIAL AREA (SECTOR 6)", "AL NOOR HOSPITAL GULBERG", "HYDERI","NAZIMABAD PETROL PUMP","NAZIMABAD No 1","SHERSHAH","GULBAI"] },
{ type: "local-bus", number: "DAATA",fare: 20,               details: "City Route", stops: ["SURJANI KDA", "4K CHOWRANGI", "GODHRA","SHAFIQ MOR","GULSHAN CHOWRANGI","NIPA CHOWRANGI","NEW SABZI MANDI","HASSAN SQUARE","JAIL CHOWRANGI","TARIQ ROAD","NURSERY","REGENT PLAZA (SIUT)","JPMC(JINNAH HOSPITAL)","ASKARI 1","CANTT STATION","PUNJAB CHOWRANGI","DO TALWAR","CLIFTON","ABDULLAH SHAH GHAZI","DOLMEN MALL - CLIFTON"] },
{ type: "local-bus", number: "F-11", fare: 20,               details: "City Route", stops: ["PAKHTOONABAD", "NAYA NAZIMABAD -MAIN GATE", "NUSRAT BHUTTO COLONY","WALANDARIYA","SAKHI HASAN CHORANGI","PIYALA HOTEL -PEOPLES CHOWRANGI","GULBERG CHOWRANGI","WATER PUMP","KARACHI INSTITUTE OF HEART DISEASE","LUCKY ONE MALL"," GULSHAN CHOWRANGI","NIPA","METRO SAFARI","FEDERAL UNIVERSITY ROAD","HASSAN SQUARE","NEW TOWN","JAIL CHOWRANGI","TARIQ ROAD","SOCEITY OFICE -P.E.C.H.S","ALLAH WALI CHOWRANGI -TARIQ ROAD","FTC BUILDING","NURSERY","KALAPUL","DEFENCE MOR","DHA PHASE 2","AKHTAR COLONY","QAYYUMABAD","KORANGI CROSSING ROAD","KORANGI 1","KORANGI 2","KORANGI 3","KORANGI 4","KORANGI 5","KORANGI 6","89LANDHI Rd","DAWOOD CHOWRANGI","GUL AHMED MILL","BHAINS COLONY MOR"] },
{ type: "local-bus", number: "G-3",  fare: 20,               details: "City Route", stops: ["SAFOORA", "MAUSAMIYAT", "KARACHI UNIVERSITY","NED UNIVERSITY","UNIVERSITY ROAD","SAFARI PARK","METRO SAFARI STORE","NIPA","FEDERAL URDU UNIVERSITY Rd","SIR SYED UNIVERSITY","HASSAN SQUARE","EXPO CENTER","CIVIC CENTER","OLD SABZI MANDI","JAIL CHOWRANGI","JAMSHED ROAD","NUMAISH CHOWRANGI","SEVENTH-DAY ADVENTIST HOSPITAL","ISLAMIA COLLEGE -NEW M.A JINNAH ROAD","SADDAR","LINES AREA","BURNS ROAD","URDU BAZAAR","JAMA CLOTH MARKET","CIVIL HOSPITAL","LIGHT HOUSE","BOLTON MARKET","TOWER","ICI BRIDGE","AAGRA TAJ COLONY","GULBAI","MEEZAN HEAD OFFICE","SHERSHAH","BALDIA 2","BALDIA 3","BALDIA 4","BALDIA 6","MUHAJIR CAMP No.7"] },
{ type: "local-bus", number: "G-7",  fare: 20,               details: "City Route", stops: ["SAFOORA","DOW OJHA CAMPUS","MOSAMIYAT","KARACHI UNIVERSITY","NED UNIVERSITY","UNIVERSITY ROAD","NIPA","SIR SYED CHOWRANGI","OLD SABZI MANDI","EXPO CENTER","HASAN SQUARE","CIVIC CENTER","NEW TOWN","BAHADURABAD","TARIQ ROAD","SOCEITY GRAVEYARD","KHUDADAD COLONY","NUMAISH CHOWRANGI","MA JINNAH ROAD","JAM CLOTH MARKET","CIVIL HOSPITAL","BOLTON MARKET","TOWER","AGRA TAJ COLONY","GULBAI","MEEZAN HEAD OFFICE","SHERSHAH","MOHAJIR CAMP No. 7","MOHAJIR CAMP No 8","NAI ABADI","GULSHAN GHAZI","MOHAJIR CAMP"] },
{ type: "local-bus", number: "G-11", fare: 20,               details: "City Route", stops: ["YOUSUF GOTH", "HUB RIVER ROAD", "MURSHID HOSPITAL","MACH MOR","TRAFFIC POLICE KIOSK -BALDIA 2","PHILIPS FACTORY -S.I.T.E KARACHI","S.I.T.E POLICE STAION","METROVILLE KHYBER GATE","FRONTIER MORR METROVILLE","BADAR CHOCK","ORANGI 4","ORANGI 5","METRO CINEMA","BANARAS","BANARAS","ABDULLAH COLLEGE","BOARD OFFICE","BANK QUARTERS -NORTH NAZIMABAD","ZIAUDDIN HOSPITAL (NORTH NAZIMABAD)","MOOSA COLONY -GULBERG TOWN","KARIMABAD","NASEERABAD -GULBERG TOWN","WATER PUMP","MOTI MAHAL","NIPA CHOWRANGI","KARACHI SAFARI PARK","METRO SAFARI STORE","ABDULLAH APARTMENTS -GULISTAN-E-JOHAR","JOHAR MOR","JOHAR CHOWRANGI","RABIA CITY -GULISTAN-E-JOHAR","PEHLWAN GOTH","SAFOORA","KIRAN HOSPITAL","MAROORA GOTH BUS STOP"] },
{ type: "local-bus", number: "G-13", fare: 20,               details: "City Route", stops: ["BANARAS", "METRO CINEMA", "ABDULLAH COLLEGE","KDA CHOWRANGI","ZIAUDDIN HOSPITAL (NORTH NAZIMABAD)","LANDI KOTAL CHOWRANGI","MEENA BAZAAR","KARIMABAD"] },
{ type: "local-bus", number: "G-17", fare: 20,               details: "City Route", stops: ["MACH MOR","POLICE TRAINING CENTER SAEEDABAD","RUBI MOR","PARESHAN CHOWK -FAQIR COLONY Rd","FAQIR COLONY","BADAR CHOWK","BACHA KHAN CHOWK","ABDULLAH COLLEGE","BOARD OFFICE","HYDERI","SAKHI HASN CHOWRANGI","ERUM SHOPPING","NAGAN CHOWRANGI","AL NOOR MOR","SOHRAB GOTH","AL ASIF SQUARE","ABUL HASAN ISPHANI ROAD","MASKAN CHOWRANGI","SAFARI PARK","METRO SAFARI STORE","UNIVERSITY ROAD","NED UNIVERSITY","KARACHI UNIVERSITY","MOSAMIYAT","SAFOORA","KIRAN HOSPITAL","MAROORA GOTH BUS STOP"] },
{ type: "local-bus", number: "G-19", fare: 20,               details: "City Route", stops: ["HUB FILTER PLANT","SULTANABAD -NEW KARACHI","SHRINES OF MANGHOPIR","NAYA NAZIMABAD -MAIN GATE","QASBA MOR","BANARAS","VALIKA","HABIB BANK CHOWRANGI","BARABOARD","JAHANGIRABAD","GOLIMAR OLD","KHAMOSH COLONY -NAZIMABAD","DAAK KHANA -LALUKHET","LIAQUATABAD No.10 LALUKHET","GHAREEBABAD","ESSA NAGRI","NIPA CHOWRANGI","HASAN SQUARE","SAFARI PARK","METRO SAFARI STORE","ALADIN PARK","JOHAR MOR","JOHAR CHOWRANGI","PEHLWAN GOTH","NATIONAL HIGHWAY 5"] },
{ type: "local-bus", number: "G-27", fare: 20,               details: "City Route", stops: ["YOUSUF GOTH", "BAKRA PIRI -YUSUF GOTH", "AFRIDI CHOWK -CHISTI NAGAR","EID GAH MOR -ORANGI","L BLOCK ROAD -AZIZ NAGAR","SABRI CHOWK ROAD -ORANGI TOWN","URDU CHOWK -ORANGI TOWN","ORANGI No10","ORANGI No4","ORANGI No5","METRO CINEMA","BANARAS","ABDULLAH COLLEGE","BOARD OFFICE","KDA CHOWRANGI","ZIAUDDIN HOSPITAL (NORTH NAZIMABAD)","LANDI KOTAL CHOWRANGI","PEOPLES CHOWRANGI","BUFFERZONE","SOHRAB GOTH","FAZAL MILL -BLOCK 21 FEDERAL B AREA","NIPA","SAFARI PARK","METRO SAFARI STORE","JOHAR CHOWRANGI","PEHLWAN GOTH","PIA SOCEITY","BAKHTAWAR GOTH -GULISTAN-E-JOHAR","SAFOORA","KIRAN HOSPITAL"] },
{ type: "local-bus", number: "GULISTAN",fare: 20,            details: "City Route", stops: ["BHITAIABAD", "HABIB UNIVERSITY", "JOHAR CHOWRANGI", "JOHAR MOR"," NIPA"," SAFARI PARK", "METRO SAFARI STORE", "FEDERAL UNIVERSITY ROAD", "HASSAN SQUARE", "EXPO CENTER", "CIVIC CENTER", "NEW TOWN", "JAIL CHOWRANGI", "NUMAISH CHOWRANGI", "M.A JINNAH ROAD", "SEVENTH-DAY ADVENTIST HOSPITAL", "URDU BAZAAR", "JAMA CLOTH MARKET", "CIVIL HOSPITAL", "BOLTON MARKET", "TOWER", "BAHRIA COMPLEX 1", "BAHRIA COMPLEX 2"," BAHRIA COMPLEX 3", "US EMBASSY KARACHI", "MAI KOLACHI ROAD", "BOAT BASIN", "BILAWAL CHOWRANGI", "SOUTH CITY HOSPITAL-CLIFTON"," ABDULLAH SHAH GHAZI", "KHAYABAN-E-ITTEHAD", "SEA VIEW -CLIFTON"," SAUDI EMBASSY -DHA V"] },
{ type: "local-bus", number: "ILYAS",fare: 20,               details: "City Route", stops: ["ITTEHAD TOWN", "BALDIA 9", "BALDIA 8", "BISMILLAH CHOWK", "JUNGLE SCHOOL (BALDIA)", "POLICE TRAINING CENTER SAEEDABAD", "MACH MOR", "BALDIA 4", "BALDIA 3", "BALDIA 2"," SHERSHAH", "MEEZAN HEAD OFFICE"," GULBAI", "AGRA TAJ COLONY", "IC BRIDGE", "TOWER", "I.I. CHUNDRIGAR", "BOLTON MARKET", "LIGHT HOUSE", "ARTS COUNCIL OF PAKISTAN KARACHI", "GOVERNOR HOUSE SINDH", "PIDC", "CANTT STATION", "DELHI COLONY", "PUNJAB CHOWRANGI", "DEFENCE MOR", "NMC HOSPITAL", "DHA II", "KPT INTERCHANGE"," QAYYUMABAD", "INDUS HOSPITAL -KORANGI", "KORANGI 1", "KORANGI 2", "KORANGI 3", "KORANGI 6", "KORANGI 5", "LANDHI 6", "LANDHI 5", "LANDHI 4", "LANDHI 3", "LANDHI 2", "LANDHI 1", "BHAINS COLONY MOR"] },
{ type: "local-bus", number: "IMRAN", fare: 20,              details: "City Route", stops: ["HAWKSBAY BEACH", "PAKISTAN MARINE ACADEMY MARIPUR", "GULBAI", "AGRA TAJ COLONY", "IC BRIDGE", "KHARADAR", "TOWER", "BOAT BASIN", "PUNJAB CHOWRANGI", "GOLD MARK SHOPPING MALL1", "ASKARI 1 -KARACHI", "KPT INTERCHANGE", "IMTIAZ STORE -KPT INTERCHANGE", "QAYYUMABAD"] },
{ type: "local-bus", number: "KHAN",  fare: 20,              details: "City Route", stops: ["ABDULLAH CHOWK", "SURJANI KDA", "KARIMI CHOWRANGI", "4K CHOWRANGI", "2 MINUTE CHOWRANGI", "ROAD 2400 -AISHA COMPLEX", "POWERHOUSE CHOWRANGI", "ROAD 4200 -SALEEM CENTER", "UP MOR", "NAGAN CHOWRANGI", "ERUM SHOPPING MALL", "SAKHI HASAN CHOWRANGI", "JUMMAH BAZAAR (BHAYANI CENTER)", "FIVE STAR CHOWRANGI", "HYDERI", "BOARD OFFICE", "ANNU BHAI PARK", "ENQUIRY OFFICE", "NAZIMABAD No1", "SANITARY MARKET (GULBAHAR)", "LASBELA"," PATEL PARA (GURU MANDIR)", "NUMAISH CHOWRANGI", "M.A JINNAH ROAD"," SEVENTH-DAY ADVENTIST HOSPITAL", "URDU BAZAAR", "JAMA CLOTH MARKET", "CIVIL HOSPITAL", "BOLTON MARKET", "TOWER", "US EMBASSY KARACHI"] },
{ type: "local-bus", number: "MARWAT",fare: 20,              details: "City Route", stops: ["QAYYUMABAD", "SHAAN CHOWRANGI", "JAMIA DARUL ULOOM KARACHI", "FUTURE COLONY -LANDHI TOWN", "DAWOOD CHOWRANGI", "QUAIDABAD", "MALIR 15", "KALA BOARD", "MALIR HALT", "DRIGH ROAD", "BALOCH COLONY", "LAL KOTHI SHAHRAH-E-FAISAL"," NURSERY", "ALLAH WALI CHOWRANGI -TARIQ ROAD", "TARIQ ROAD", "KHUDABAD COLONY", "NUMAISH CHOWRANGI", "M.A JINNAH ROAD", "JAMA CLOTH MARKET", "LIGHT HOUSE", "BOLTON MARKET", "TOWER"," KHARADAR", "ICI BRIDGE", "AGRA TAJ COLONY"," GULBAI"," PAF MASROOR BASE -MAURI PUR", "TRUCK ADA MAURI PUR", "PAKISTAN MARINE ACADEMY MAURIPUR", "HAWKSBAY BEACH", "BHUDNI GOTH" ] },
{ type: "local-bus", number: "MASHALLAH",fare: 20,           details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "MASHRIQ",  fare: 20,           details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "MASOOD",   fare: 20,           details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "MUSLIM", fare: 20,             details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "N",      fare: 20,             details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "N-4",   fare: 20,              details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "N-5",   fare: 20,              details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "NEW AFRIDI",fare: 20,          details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "R-13",      fare: 20,          details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "SAFARI COACH", fare: 20,       details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "SHIRAZ",  fare: 20,            details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "SL",   fare: 20,               details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "SUPER HASAN ZAI",fare: 20,     details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "SUPER MUSLIM COACH",fare: 20,  details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "W-11",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "W-22",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "W-25",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "W-55",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "X-10",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "X-23",fare: 20,                details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "X-8",fare: 20,                 details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },
{ type: "local-bus", number: "Z-2",fare: 20,                 details: "City Route", stops: ["Stop P", "Stop Q", "Stop R"] },


{ type: "chinchi", number: "007",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "2-J",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "4-E",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "4-X",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "555",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "786",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "7-D",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "8",fare: 20,                     details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "A", fare: 20,                    details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "A-1",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "A-18", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "AA1",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "AS-1", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "B-1",fare: 20,                   details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "B-3", fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "B-9", fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "D-13",fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "D-22",fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "D-3", fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "DOUBLE JHANDA",fare: 20,         details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "F-12",fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "FM",  fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "FS-1",fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "G-2", fare: 20,                  details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "G-25", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "G-7 CHINCHI", fare: 20,          details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "GM",     fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "J-1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "JF17",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-18",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-4",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-5",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-6",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "K-86",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "KARACHI KING",fare: 20,          details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-1",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-10", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-22", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-5",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-55", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-7",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "M-9",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "MK-081",fare: 20,                details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "N-1",   fare: 20,                details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "N-A(BALDIA)",fare: 20,           details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "N-55",      fare: 20,            details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "N-91",  fare: 20,                details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "NASEEB", fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "ND1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "P-1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "RAZAQ",  fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "R-S",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "S-2",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "S-7",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "S-K",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "SULTAN", fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "T-10",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "T-11",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "T-99",   fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "U-5",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "V-1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "W-1",    fare: 20,               details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "W-11 CHINCHI",fare: 20,          details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "W-86", fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
{ type: "chinchi", number: "X-2",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] },
    
{ type: "chinchi", number: "Z-4",  fare: 20,                 details: "Short Distance Ride", stops: ["Stop M", "Stop N", "Stop O"] }
];
export default function Routes() {
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    const openModal = (route: Route) => {
        setSelectedRoute(route);
        setModalOpen(true);
    };
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    

    const closeModalAction = () => {
        setSelectedRoute(null);
        setModalOpen(false);
    };

    return (
        <div className="p-4">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search by route number, details, or stops..."
                    aria-label="Search routes"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {routes
                .filter(
                (route) =>
                    route.number
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                    route.details
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((route, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="cursor-pointer border border-gray-200 p-4 rounded-md hover:shadow-lg transition-shadow"
                    onClick={() => openModal(route)}
                >
                    <div className="flex items-center space-x-3">
                    <Image
                        src={iconMapping[route.type]}
                        alt={route.type}
                        width={40}
                        height={40}
                    />
                    <div>
                        <h3 className="text-lg font-medium">
                        {route.number}
                        </h3>
                        <p className="text-sm text-gray-500">
                        {route.details}
                        </p>
                    </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                    {route.stops.length} stops | Fare: Rs {route.fare}
                    </div>
                </motion.div>
                ))}
            </div>
            <Modal
            isOpen={isModalOpen}
            onCloseAction={closeModalAction}
            route={selectedRoute ? { ...selectedRoute, fare: { min: selectedRoute.fare || 0, max: selectedRoute.fare || 0 } } : null}
            />
        </div>
    );
}
