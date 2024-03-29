export const ABC={toAscii:function(a){return a.replace(/\s*[01]{8}\s*/g,function(a){return String.fromCharCode(parseInt(a,2))})},toBinary:function(a,b){return a.replace(/[\s\S]/g,function(a){a=ABC.zeroPad(a.charCodeAt().toString(2));return!1==b?a:a+" "})},zeroPad:function(a){return"00000000".slice(String(a).length)+a}};
export const CANADA_PROVINCES =
[
	{ label: 'Alberta', value: 'AB'},
    { label: 'British Columbia', value: 'BC'},
    { label: 'Manitoba', value: 'MB'},
    { label: 'New Brunswick', value: 'NB'},
    { label: 'Newfoundland and Labrador', value: 'NL'},
    { label: 'Northwest Territories', value: 'NT'},
    { label: 'Nova Scotia', value: 'NS'},
    { label: 'Nunavut', value: 'NU'},
    { label: 'Ontario', value: 'ON'},
    { label: 'Prince Edward Island', value: 'PE'},
    { label: 'Quebec', value: 'QC'},
    { label: 'Saskatchewan', value: 'SK'},
    { label: 'Yukon', value: 'YT'}
];

export const PROFESSIONS =
[
	{label: 'Optometrist', value: 'optometrist'},
	{label: 'Ophthalmologist', value: 'ophthalmologist'},
	{label: 'Pharmacist', value: 'pharmacist'},
	{label: 'General Phisician', value: 'gp'},
	{label: 'Medical Specialist', value: 'md_specialist'}
];

export const COUNTRIES =
[
	{ label: 'Canada', value: 'CA'},
	{ label: 'USA', value: 'US'}	
];

export const USA_STATES = 
[
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "American Samoa", value: "AS" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
    { label: "Delaware", value: "DE" },
    { label: "District Of Columbia", value: "DC" },
    { label: "Federated States Of Micronesia", value: "FM" },
    { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" },
    { label: "Guam", value: "GU" },
    { label: "Hawaii", value: "HI" },
    { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" },
    { label: "Indiana", value: "IN" },
    { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" },
    { label: "Kentucky", value: "KY" },
    { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" },
    { label: "Marshall Islands", value: "MH" },
    { label: "Maryland", value: "MD" },
    { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" },
    { label: "Minnesota", value: "MN" },
    { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" },
    { label: "Montana", value: "MT" },
    { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" },
    { label: "New Hampshire", value: "NH"},
    { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" },
    { label: "New York", value: "NY" },
    { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" },
    { label: "Northern Mariana Islands", value: "MP" },
    { label: "Ohio", value: "OH" },
    { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" },
    { label: "Palau", value: "PW" },
    { label: "Pennsylvania", value: "PA" },
    { label: "Puerto Rico", value: "PR" },
    { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" },
    { label: "South Dakota", value: "SD" },
    { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" },
    { label: "Utah", value: "UT" },
    { label: "Vermont", value: "VT" },
    { label: "Virgin Islands", value: "VI" },
    { label: "Virginia", value: "VA" },
    { label: "Washington", value: "WA" },
    { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" },
    { label: "Wyoming", value: "WY" }
];

export const getCountryProvinceProfession = (country, province, profession) =>
{
	let countryName='', provinceName='';
	console.log("[INFO] in getCountryProvinceProfession: ", country, " ", province, " ", profession)
	try
	{
		switch (country)
		{
			case 'CA' : provinceName = CANADA_PROVINCES.find(({value}) => value === province).label;
						countryName = 'Canada';
					    break;
			case 'US' : provinceName = USA_STATES.find(({value}) => value === province).label;
						countryName = 'USA';
					    break;
			default: break;
		}
	}
	catch (e)
	{
		console.error("[ERROR]: ", e);
	}
	return {country: countryName, province: provinceName, profession: PROFESSIONS.find(({value}) => value === profession).label};
}