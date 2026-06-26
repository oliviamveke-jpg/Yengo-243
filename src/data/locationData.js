/**
 * Kinshasa Location Database
 * 
 * This database contains verified geographic coordinates for Kinshasa communes and quartiers.
 * All coordinates are sourced from authoritative geographic databases (OpenStreetMap/Nominatim).
 * 
 * Data Source: OpenStreetMap (https://nominatim.openstreetmap.org)
 * License: ODbL 1.0 (https://osm.org/copyright)
 * 
 * Streets are not pre-stored. Use the geocoding service for dynamic street lookup.
 */

export const kinshasaLocationData = {
  province: 'Kinshasa',
  ville: 'Kinshasa Ville',
  coords: [-4.3219402, 15.3118474],
  centroid: [-4.3219402, 15.3118474],
  boundary: {
    minLat: -4.4817100,
    maxLat: -4.1617100,
    minLon: 15.1522511,
    maxLon: 15.4722511
  },
  dataSource: 'OpenStreetMap/Nominatim',
  osmId: 27043346,
  streets: [],
  communes: {
    Bandalungwa: {
      coords: [-4.3422198, 15.2831648],
      centroid: [-4.3422198, 15.2831648],
      boundary: {
        minLat: -4.3609805,
        maxLat: -4.3230663,
        minLon: 15.2715435,
        maxLon: 15.2965074
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388091,
      quartiers: {
        'Adoula': null,
        'Bisengo': null,
        'Lubudi': null,
        'Lumumba': null,
        'Kasa Vubu': null
      }
    },
    Barumbu: {
      coords: [-4.3190075, 15.3256934],
      centroid: [-4.3190075, 15.3256934],
      boundary: {
        minLat: -4.3324563,
        maxLat: -4.3053299,
        minLon: 15.3145709,
        maxLon: 15.3365495
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388104,
      quartiers: {
        'Bitshaku-Tshaku': null,
        'Funa I': null,
        'Funa II': null,
        'Kapinga Bapu': null,
        'Kasai': null,
        'Libulu': null,
        'Mozindo': null,
        'N\'dolo': null,
        'Tshimanga': null
      }
    },
    Bumbu: {
      coords: [-4.3725905, 15.2934444],
      centroid: [-4.3725905, 15.2934444],
      boundary: {
        minLat: -4.3852898,
        maxLat: -4.3598829,
        minLon: 15.2826903,
        maxLon: 15.3054979
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388134,
      quartiers: {
        'Mongala': null,
        'Ubangi': null,
        'Lokoro': null,
        'Kwango': null,
        'Lukénie': null,
        'Kasaï': null,
        'Matadi': null,
        'Lieutenant Mbaki': null,
        'Dipiya': null,
        'Ntomba': null,
        'Mbandaka': null,
        'Maï-Ndombe': null,
        'Mfimi': null
      }
    },
    Gombe: {
      coords: [-4.3119751, 15.2894296],
      centroid: [-4.3119751, 15.2894296],
      boundary: {
        minLat: -4.3277829,
        maxLat: -4.2962669,
        minLon: 15.2651860,
        maxLon: 15.3445113
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388098,
      quartiers: {
        'Batetela': null,
        'Haut Commandement': null,
        'Croix Rouge': null,
        'Lemera': null,
        'Golf': null,
        'Fleuve': null,
        'Gare': null,
        'Commerce': null,
        'Révolution': null,
        'Cliniques': null
      }
    },
    Kalamu: {
      coords: [-4.3495584, 15.3179297],
      centroid: [-4.3495584, 15.3179297],
      boundary: {
        minLat: -4.3693683,
        maxLat: -4.3297604,
        minLon: 15.3056072,
        maxLon: 15.3270541
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388127,
      quartiers: {
        'Yolo-Nord 1': null,
        'Yolo-Nord 2': null,
        'Yolo-Nord 3': null,
        'Yolo-Sud 1': null,
        'Yolo-Sud 2': null,
        'Yolo-Sud 3': null,
        'Yolo-Sud 4': null,
        'Immo-Congo': null,
        'Matonge 1': {
          coords: [-4.3339259, 15.3177736],
          centroid: [-4.3339259, 15.3177736],
          boundary: {
            minLat: -4.3379905,
            maxLat: -4.3297604,
            minLon: 15.3142004,
            maxLon: 15.3215208
          },
          dataSource: 'OpenStreetMap/Nominatim',
          osmId: 9424454
        },
        'Matonge 2': {
          coords: [-4.3390696, 15.3172413],
          centroid: [-4.3390696, 15.3172413],
          boundary: {
            minLat: -4.3426610,
            maxLat: -4.3363445,
            minLon: 15.3136870,
            maxLon: 15.3204882
          },
          dataSource: 'OpenStreetMap/Nominatim',
          osmId: 9424452
        },
        'Matonge 3': {
          coords: [-4.3445821, 15.3151650],
          centroid: [-4.3445821, 15.3151650],
          boundary: {
            minLat: -4.3480846,
            maxLat: -4.3407725,
            minLon: 15.3118464,
            maxLon: 15.3195843
          },
          dataSource: 'OpenStreetMap/Nominatim',
          osmId: 9424450
        },
        'Quartier Kauka 1': null,
        'Quartier Kauka 2': null,
        'Quartier Kauka 3': null,
        'Kimbangu 1': null,
        'Kimbangu 2': null,
        'Kimbangu 3': null,
        'Camp Pinzi': null
      }
    },
    'Kasa-Vubu': {
      coords: [-4.3417150, 15.3040174],
      centroid: [-4.3417150, 15.3040174],
      boundary: {
        minLat: -4.3525804,
        maxLat: -4.3315532,
        minLon: 15.2918053,
        maxLon: 15.3149124
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388094,
      quartiers: {
        'ONL': null,
        'Katanga': null,
        'Anciens combattants': null,
        'Assossa': null,
        'Lubumbashi': null,
        'Lodja': null,
        'Salongo': {
          coords: [-4.3360390, 15.3056564],
          centroid: [-4.3360390, 15.3056564],
          boundary: {
            minLat: -4.3394405,
            maxLat: -4.3324090,
            minLon: 15.3007733,
            maxLon: 15.3116347
          },
          dataSource: 'OpenStreetMap/Nominatim',
          osmId: 9405604
        }
      }
    },
    Kimbanseke: {
      coords: [-4.4417135, 15.4035444],
      centroid: [-4.4417135, 15.4035444],
      boundary: {
        minLat: -4.4871439,
        maxLat: -4.3962789,
        minLon: 15.3523502,
        maxLon: 15.4633342
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389614,
      quartiers: {
        '17-Mai': null,
        'Bahumbu': null,
        'Bamboma': null,
        'Biyela': null,
        'Boma': null,
        'Disasi': null,
        'Esanga': null,
        'Kamba Mulumba': null,
        'Kasa-Vubu': null,
        'Kikimi': null,
        'Kingasani': null,
        'Kisantu IR ben': null,
        'Kutu': null,
        'Luebo': null,
        'Malonda': null,
        'Mangana': null,
        'Maviokele': null,
        'Mbuala': null,
        'Mfumu Nkento': null,
        'Mikondo': null,
        'Mokali': null,
        'Mulie': null,
        'Ngamazita': null,
        'Ngampani': null,
        'Ngandu': null,
        'Nsanga': null,
        'Nsumabwa': null,
        'Révolution': null,
        'Sakombi': null,
        'Salongo': null
      }
    },
    Kinshasa: {
      coords: [-4.3219402, 15.3118474],
      centroid: [-4.3219402, 15.3118474],
      boundary: {
        minLat: -4.3339911,
        maxLat: -4.3104843,
        minLon: 15.3027387,
        maxLon: 15.3211305
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388103,
      quartiers: {
        'Kinshasa Centre': null,
        'Kinshasa-Est': null,
        'Kinshasa-Ouest': null,
        'Aketi': null
      }
    },
    Kintambo: {
      coords: [-4.3434333, 15.2667484],
      centroid: [-4.3434333, 15.2667484],
      boundary: {
        minLat: -4.3594746,
        maxLat: -4.3279259,
        minLon: 15.2592077,
        maxLon: 15.2803430
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388090,
      quartiers: {
        'Wenze': null,
        'Tshinkela': null,
        'Salongo': null,
        'Lubudi Nganda': null,
        'Lubudi Luka': null,
        'Lisala': null,
        'Kilimani': null,
        'Itimbiri': null
      }
    },
    Kisenso: {
      coords: [-4.4176622, 15.3416621],
      centroid: [-4.4176622, 15.3416621],
      boundary: {
        minLat: -4.4400943,
        maxLat: -4.3952702,
        minLon: 15.3138225,
        maxLon: 15.3639668
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389536,
      quartiers: {
        '17 mai': null,
        'Amba': null,
        'Bikanga': null,
        'Dingi-Dingi': null,
        'Kabila': null,
        'Kisenso-Gare': null,
        'Kitomesa': null,
        'Kumbu': null,
        'Libération': null,
        'Mbuku': null,
        'Mission': null,
        'Mujinga': null,
        'Ngomba': null,
        'Nsola': null,
        'Quartier de la Paix': null,
        'Regideso': null,
        'Révolution': null
      }
    },
    Lemba: {
      coords: [-4.4039708, 15.3173399],
      centroid: [-4.4039708, 15.3173399],
      boundary: {
        minLat: -4.4344356,
        maxLat: -4.3733971,
        minLon: 15.3017188,
        maxLon: 15.3488146
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 10089740,
      quartiers: {
        'Kimpwanza': null,
        'Madrandele': null,
        'Ecole': null,
        'Masano': null,
        'Foire': null,
        'Salongo': null,
        'Livulu Tadi': null,
        'Kemi': null,
        'Mbanza-Lemba': null,
        'Molo': null,
        'Gombele': null,
        'Commercial': null,
        'Echangeur': null
      }
    },
    Limete: {
      coords: [-4.3543467, 15.3466854],
      centroid: [-4.3543467, 15.3466854],
      boundary: {
        minLat: -4.3873785,
        maxLat: -4.3208227,
        minLon: 15.3200492,
        maxLon: 15.3812046
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388599,
      quartiers: {
        'Agricole': null,
        'Industriel': null,
        'Kingabwa': null,
        'Masiala': null,
        'Mateba': null,
        'Mayulu': null,
        'Mbamu': null,
        'Mfumu-Mvula': null,
        'Mombele': null,
        'Mososo': null,
        'Ndanu': null,
        'Nzadi': null,
        'Residentiel': null,
        'Salongo': null
      }
    },
    Lingwala: {
      coords: [-4.3252537, 15.3012644],
      centroid: [-4.3252537, 15.3012644],
      boundary: {
        minLat: -4.3370759,
        maxLat: -4.3130380,
        minLon: 15.2921689,
        maxLon: 15.3079295
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388097,
      quartiers: {
        'Lingwala Centre': null,
        'La Voix du Peuple': null,
        'Camp Militaire': null
      }
    },
    Makala: {
      coords: [-4.3829614, 15.3085467],
      centroid: [-4.3829614, 15.3085467],
      boundary: {
        minLat: -4.4004113,
        maxLat: -4.3655179,
        minLon: 15.2984798,
        maxLon: 15.3200492
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388133,
      quartiers: {
        'Bagata': null,
        'Bahumbu': null,
        'Bolima': null,
        'Kabila': null,
        'Kisantu': null,
        'Kwango': null,
        'Lemba village': null,
        'Mabulu I': null,
        'Mabulu II': null,
        'Malala': null,
        'Mawanga': null,
        'Mmfidi': null,
        'Mikasi': null,
        'Salongo': null,
        'Selo': null,
        'Tampa': null,
        'Uele': null,
        'Wamba': null
      }
    },
    Maluku: {
      coords: [-4.0548949, 15.5612096],
      centroid: [-4.0548949, 15.5612096],
      boundary: {
        minLat: -5.0325362,
        maxLat: -3.9276112,
        minLon: 15.5051079,
        maxLon: 16.5341234
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389746,
      quartiers: {
        'Maluku Centre': null,
        'Bois de N\'Vuma': null,
        'Bensati': null
      }
    },
    Masina: {
      coords: [-4.3661666, 15.3909815],
      centroid: [-4.3661666, 15.3909815],
      boundary: {
        minLat: -4.4059524,
        maxLat: -4.3263350,
        minLon: 15.3610098,
        maxLon: 15.4276275
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389694,
      quartiers: {
        'Abattoir': null,
        'Boba': null,
        'Congo': null,
        'Efoloko': null,
        'Imbali': null,
        'Kasai': null,
        'Kimbangu': null,
        'Mafuta Kizola': null,
        'Mapela': null,
        'Lokari': null,
        'Lubamba': null,
        'Mandiangu': null,
        'Kivu': null,
        'Matadi': null,
        'Mfumu Suka': null,
        'Nzuzi wa Mbombo': null,
        'Pelende': null,
        'Sans Fil': null,
        'Tshango': null,
        'Tshuenge': null,
        'Télévision': null
      }
    },
    Matete: {
      coords: [-4.3889613, 15.3512504],
      centroid: [-4.3889613, 15.3512504],
      boundary: {
        minLat: -4.3987373,
        maxLat: -4.3789984,
        minLon: 15.3361697,
        maxLon: 15.3673947
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389334,
      quartiers: {
        'Matete Centre': null,
        'Sumbuka': null,
        'Salongo': null,
        'Funa': null,
        'Kingabwa': null
      }
    },
    'Mont Ngafula': {
      coords: [-4.4949926, 15.2677266],
      centroid: [-4.4949926, 15.2677266],
      boundary: {
        minLat: -4.6488934,
        maxLat: -4.3398461,
        minLon: 15.1298164,
        maxLon: 15.4083736
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389761,
      quartiers: {
        'Camp Luka': null,
        'Saar': null,
        'Binza': null,
        'Kimbondo': null,
        'Mabanga': null,
        'Camp Militaire': null
      }
    },
    Ndjili: {
      coords: [-4.4067179, 15.3753800],
      centroid: [-4.4067179, 15.3753800],
      boundary: {
        minLat: -4.4261449,
        maxLat: -4.3871989,
        minLon: 15.3598667,
        maxLon: 15.3900663
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 10722139,
      quartiers: {
        'Quartier 1': null,
        'Quartier 2': null,
        'Quartier 3': null,
        'Quartier 4': null,
        'Quartier 5': null,
        'Quartier 6': null,
        'Quartier 7': null,
        'Quartier 8': null,
        'Quartier 9': null,
        'Quartier 10': null,
        'Quartier 11': null,
        'Quartier 12': null,
        'Quartier 13': null
      }
    },
    Ngaba: {
      coords: [-4.3813246, 15.3218098],
      centroid: [-4.3813246, 15.3218098],
      boundary: {
        minLat: -4.3927067,
        maxLat: -4.3693683,
        minLon: 15.3148534,
        maxLon: 15.3331564
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388139,
      quartiers: {
        'Baobab': null,
        'Bulambemba': null,
        'Luyi': null,
        'Mateba': null,
        'Mpila': null,
        'Mukulwa': null
      }
    },
    Ngaliema: {
      coords: [-4.3754721, 15.2473634],
      centroid: [-4.3754721, 15.2473634],
      boundary: {
        minLat: -4.4340924,
        maxLat: -4.3170465,
        minLon: 15.1909820,
        maxLon: 15.2814768
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389760,
      quartiers: {
        'Lukunga': null,
        'Ngomba Kikusa': null,
        'Bumba': null,
        'Binza-Pigeon': null,
        'Djelo Binza': null,
        'Bangu': null,
        'Punda': null,
        'Kimpe': null,
        'Anciens Combattants': null,
        'Basoko': null,
        'Congo': null,
        'Joli Parc': null,
        'Kinkenda': null,
        'Kinsuka Pêcheur': null,
        'Lonzo': null,
        'Musey': null,
        'Mama-Yemo': null,
        'Manenga': null,
        'Mfinda': null,
        'Monganga': null,
        'Lubudi': null
      }
    },
    'Ngiri-Ngiri': {
      coords: [-4.3568943, 15.2986942],
      centroid: [-4.3568943, 15.2986942],
      boundary: {
        minLat: -4.3658097,
        maxLat: -4.3480012,
        minLon: 15.2878655,
        maxLon: 15.3105796
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 10993823,
      quartiers: {
        'Assossa': null,
        'Diangenda': null,
        'Diomi': null,
        'Elengesa': null,
        'Khartoum': null,
        'Petit-Petit': null,
        '24 Novembre': null,
        'Saïo I': null,
        'Saïo II': null
      }
    },
    Nsele: {
      coords: [-4.3505573, 15.5663311],
      centroid: [-4.3505573, 15.5663311],
      boundary: {
        minLat: -4.5890838,
        maxLat: -4.1120831,
        minLon: 15.3491636,
        maxLon: 15.7154515
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 389689,
      quartiers: {
        'Nsele Centre': null,
        'Kitambo': null,
        'Monganga': null,
        'Bensati': null
      }
    },
    Selembao: {
      coords: [-4.4009591, 15.2852376],
      centroid: [-4.4009591, 15.2852376],
      boundary: {
        minLat: -4.4420583,
        maxLat: -4.3598829,
        minLon: 15.2564524,
        maxLon: 15.3012338
      },
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: 388135,
      quartiers: {
        'Badiandingi': null,
        'Cité Verte': null,
        'Inga': null,
        'Kalunga': null,
        'Konde': null,
        'Ndobe': null,
        'Lubudi': null,
        'Madiata': null,
        'Nkingu': null,
        'Molende': null,
        'Nkombe': null,
        'Muana-Tunu': null,
        'Ngafani': null,
        'Mbala': null,
        'Herady': null,
        'Libération': null,
        'Nkulu': null,
        'Pululu-Mbambu': null
      }
    }
  }
}
