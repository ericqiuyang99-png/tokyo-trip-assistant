import type { Itinerary } from "../types/trip";

export const ITINERARY_REVISION = "chrome-sync-20260430-1";

export const defaultTrip: Itinerary = {
  "trip": {
    "title": "东京旅行 2026",
    "dates": "2026-05-02 ~ 2026-05-05",
    "hotel": "Park Hyatt Tokyo, Shinjuku",
    "travelers": 6,
    "itineraryRevision": "chrome-sync-20260430-1"
  },
  "days": [
    {
      "id": 1,
      "date": "2026-05-02",
      "label": "Day 1",
      "note": "下午落地，新宿轻松展开",
      "spots": [
        {
          "id": "ai-1777534450960-v18dy",
          "name": "Park Hyatt Tokyo",
          "nameJa": "パークハイアット東京",
          "icon": "🏨",
          "time": "14:30",
          "duration": 30,
          "lat": 35.6856,
          "lng": 139.6907,
          "category": "酒店",
          "address": "3-7-1-2 Nishi Shinjuku, Shinjuku City, Tokyo",
          "desc": "从酒店出发，整理行李并准备开始东京之旅。酒店位于新宿中心，交通便利。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚶 步行",
            "duration": "18分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "¥500",
            "reservation": false,
            "url": "https://fng.or.jp/shinjuku/"
          },
          "bestTime": "下午抵达后稍作休整",
          "tips": [
            "确认房间入住",
            "了解酒店设施",
            "规划当日行程路线"
          ],
          "warning": null
        },
        {
          "id": "ai-1777534380655-f3mhr",
          "name": "唐吉坷德新宿本店",
          "nameJa": "ドン・キホーテ新宿本店",
          "icon": "🛍",
          "time": "16:00",
          "duration": 60,
          "lat": 35.6938,
          "lng": 139.7034,
          "category": "购物",
          "address": "1 Chome-16-5 Kabukicho, Shinjuku City, Tokyo",
          "desc": "24小时营业的综合折扣店，从日用品到奇特商品应有尽有，是体验日本独特购物文化的好地方。新宿本店商品种类最全。",
          "transport": {
            "from": "东京都厅",
            "method": "🚶 步行",
            "duration": "12分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "免费入店",
            "reservation": false,
            "url": "https://www.donki.com/"
          },
          "bestTime": "20:00-21:00，晚上逛街氛围更好，且24小时营业不用担心关门",
          "tips": [
            "24小时营业，不用担心时间",
            "商品种类繁多，容易迷路",
            "可以买到很多有趣的伴手礼",
            "部分商品可以退税"
          ],
          "warning": null
        },
        {
          "id": "d1s1",
          "name": "新宿御苑",
          "nameJa": "新宿御苑",
          "icon": "🌿",
          "time": "17:30",
          "duration": 90,
          "lat": 35.6852,
          "lng": 139.7101,
          "category": "公园",
          "address": "11 Naitomachi, Shinjuku City, Tokyo",
          "desc": "融合日式、英式、法式三种园林风格，5月绿意最盛。适合用安静的步调开启东京行程。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚶 步行",
            "duration": "18分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "¥500",
            "reservation": false,
            "url": "https://fng.or.jp/shinjuku/"
          },
          "bestTime": "15:00-17:30，午后光线柔和，人流逐渐回落。",
          "tips": [
            "周一休园，黄金周期间仍需确认开放时间",
            "园内步行较多，建议轻装",
            "17:30前后陆续闭园"
          ],
          "warning": null
        },
        {
          "id": "ai-1777534965365-cqdy6",
          "name": "Harajuku Etoffe Jellycat",
          "nameJa": "原宿エトフ ジェリーキャット",
          "icon": "🧸",
          "time": "18:15",
          "duration": 45,
          "lat": 35.6702,
          "lng": 139.7027,
          "category": "购物",
          "address": "6 Chome-28-6 Jingumae, Shibuya City, Tokyo",
          "desc": "原宿的Jellycat专门店，有各种可爱的毛绒玩具和限定商品。从涩谷步行过来很方便，是购买伴手礼的好地方。",
          "transport": {
            "from": "涩谷十字路口",
            "method": "🚶 步行",
            "duration": "15分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "商品价格不等",
            "reservation": false,
            "url": "https://www.etoffe.co.jp/"
          },
          "bestTime": "18:15-19:00，傍晚时段人流适中",
          "tips": [
            "Jellycat毛绒玩具种类丰富",
            "部分商品有日本限定款",
            "可以刷卡支付",
            "注意营业时间"
          ],
          "warning": null
        },
        {
          "id": "d4s3",
          "name": "涩谷十字路口",
          "nameJa": "渋谷スクランブル交差点",
          "icon": "🚦",
          "time": "17:30",
          "duration": 25,
          "lat": 35.6595,
          "lng": 139.7005,
          "category": "地标",
          "address": "Shibuya Scramble Crossing, Tokyo",
          "desc": "东京最具辨识度的城市路口，傍晚时分人流与灯光效果最佳，适合快速打卡拍照。",
          "transport": {
            "from": "东京都厅",
            "method": "🚇 大江户线 + JR山手线",
            "duration": "25分钟",
            "cost": "约¥260"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": "https://www.metro.tokyo.lg.jp/"
          },
          "bestTime": "17:30-18:00，傍晚人流充足且光线较好",
          "tips": [
            "注意红绿灯安全",
            "拍照不要停在路中间",
            "周边咖啡店可俯拍但可能排队"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：涩谷区域人流密集"
          }
        }
      ]
    },
    {
      "id": 2,
      "date": "2026-05-03",
      "label": "Day 2",
      "note": "东京大学、上野、浅草、晴空塔、阿佐谷晚餐与六本木夜景",
      "spots": [
        {
          "id": "ai-1777534450960-v18dy",
          "name": "Park Hyatt Tokyo",
          "nameJa": "パークハイアット東京",
          "icon": "🏨",
          "time": "08:30",
          "duration": 30,
          "lat": 35.6856,
          "lng": 139.6907,
          "category": "酒店",
          "address": "3-7-1-2 Nishi Shinjuku, Shinjuku City, Tokyo",
          "desc": "从酒店出发，享用早餐并准备前往东京大学开始今天的文化之旅。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚶 步行",
            "duration": "18分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "¥500",
            "reservation": false,
            "url": "https://fng.or.jp/shinjuku/"
          },
          "bestTime": "早餐后准备出发",
          "tips": [
            "确认今日行程路线",
            "准备好交通卡",
            "带好相机和充电宝"
          ],
          "warning": {
            "level": "red",
            "text": "需提前购票：每月10日抢次月票"
          }
        },
        {
          "id": "d2s1",
          "name": "东京大学",
          "nameJa": "東京大学",
          "icon": "🎓",
          "time": "09:30",
          "duration": 75,
          "lat": 35.7138,
          "lng": 139.7627,
          "category": "文化",
          "address": "7 Chome-3-1 Hongo, Bunkyo City, Tokyo",
          "desc": "日本最顶尖的国立大学，本乡校区拥有经典的赤门和安田讲堂等历史建筑。春日时节银杏大道和校园氛围都很适合漫步。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚇 大江户线 + 丸之内线",
            "duration": "35分钟",
            "cost": "约¥260"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": "https://www.u-tokyo.ac.jp/"
          },
          "bestTime": "09:30-10:45，上午校园更安静，适合拍赤门和安田讲堂。",
          "tips": [
            "赤门、安田讲堂和银杏大道最值得停留",
            "校园内保持安静",
            "教学楼内部不建议随意进入"
          ],
          "warning": {
            "level": "red",
            "text": "需提前购票：每月10日抢次月票"
          }
        },
        {
          "id": "d2s2",
          "name": "上野公园",
          "nameJa": "上野公園",
          "icon": "🌸",
          "time": "11:00",
          "duration": 75,
          "lat": 35.7156,
          "lng": 139.773,
          "category": "公园",
          "address": "Uenokoen, Taito City, Tokyo",
          "desc": "东京最著名的赏樱地之一，虽然5月樱花季已过，但绿意盎然的公园仍很适合漫步。周边博物馆众多，是文化气息浓厚的区域。",
          "transport": {
            "from": "东京大学",
            "method": "🚶 步行",
            "duration": "15分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "公园免费，馆内按项目收费",
            "reservation": false,
            "url": "https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/"
          },
          "bestTime": "11:00-12:15，从本乡步行过来，午前人流相对可控。",
          "tips": [
            "可顺路看不忍池",
            "博物馆如要入馆需另留时间",
            "黄金周园内和餐厅都会排队"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：5月3-5日人流极高"
          }
        },
        {
          "id": "d2s3",
          "name": "浅草寺",
          "nameJa": "浅草寺",
          "icon": "⛩",
          "time": "13:30",
          "duration": 90,
          "lat": 35.7148,
          "lng": 139.7967,
          "category": "神社",
          "address": "2 Chome-3-1 Asakusa, Taito City, Tokyo",
          "desc": "东京最具代表性的古寺之一，雷门、仲见世商店街和本堂连成经典路线。黄金周人流极高，但节庆感也最强。",
          "transport": {
            "from": "上野公园",
            "method": "🚇 银座线",
            "duration": "8分钟",
            "cost": "约¥180"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": "https://www.senso-ji.jp/"
          },
          "bestTime": "13:30-15:00，午餐后顺路游览雷门和仲见世。",
          "tips": [
            "仲见世边走边吃有区域限制",
            "雷门拍照需等空档",
            "黄金周建议预留更长步行时间"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：5月3-5日人流极高"
          }
        },
        {
          "id": "d2s4",
          "name": "东京晴空塔",
          "nameJa": "東京スカイツリー",
          "icon": "🗼",
          "time": "15:20",
          "duration": 75,
          "lat": 35.7101,
          "lng": 139.8107,
          "category": "地标",
          "address": "1 Chome-1-2 Oshiage, Sumida City, Tokyo",
          "desc": "东京最高的观景塔，晴天可远眺富士山方向。黄金周排队时间显著增加，建议提前网购指定时段票。",
          "transport": {
            "from": "浅草寺",
            "method": "🚶 步行或东武晴空塔线",
            "duration": "22分钟",
            "cost": "步行免费 / 电车约¥160"
          },
          "ticket": {
            "price": "天望甲板约¥2100起",
            "reservation": true,
            "url": "https://www.tokyo-skytree.jp/"
          },
          "bestTime": "15:20-16:40，兼顾白天城市视野和晚餐交通。",
          "tips": [
            "黄金周提前网购",
            "商场电梯和厕所也会排队",
            "带好预约二维码"
          ],
          "warning": {
            "level": "red",
            "text": "需提前购票：黄金周建议网购指定时段"
          }
        },
        {
          "id": "d2s5",
          "name": "SATO Briand晚餐",
          "nameJa": "SATOブリアン",
          "icon": "🥩",
          "time": "17:20",
          "duration": 110,
          "lat": 35.7041,
          "lng": 139.6364,
          "category": "美食",
          "address": "1 Chome-37-6 Asagayaminami, Suginami City, Tokyo",
          "desc": "阿佐谷的人气和牛烧肉店，以厚切牛排和招牌牛排三明治闻名。本次6人订位已确认，务必准时抵达。",
          "transport": {
            "from": "东京晴空塔",
            "method": "🚇 半藏门线 + JR中央线",
            "duration": "55分钟",
            "cost": "约¥520"
          },
          "ticket": {
            "price": "按套餐/点单",
            "reservation": true,
            "url": "https://tabelog.com/tokyo/A1319/A131905/13164962/"
          },
          "bestTime": "17:20准时入店，订位窗口固定。",
          "tips": [
            "预订号 PGL7WKVM",
            "6人已确认",
            "从晴空塔出发需留足换乘时间"
          ],
          "warning": {
            "level": "green",
            "text": "餐厅预订已确认：5月3日17:20，6人，PGL7WKVM"
          }
        },
        {
          "id": "d2s6",
          "name": "六本木Hills森大厦观景台",
          "nameJa": "六本木ヒルズ森タワー展望台",
          "icon": "🌃",
          "time": "19:30",
          "duration": 90,
          "lat": 35.6605,
          "lng": 139.7292,
          "category": "观景",
          "address": "6 Chome-10-1 Roppongi, Minato City, Tokyo",
          "desc": "六本木Hills森大厦52层的观景台，可360度俯瞰东京夜景。比东京塔更现代化，视角更佳，且距离阿佐谷餐厅交通更便利。",
          "transport": {
            "from": "SATO Briand晚餐",
            "method": "🚇 JR中央线 + 日比谷线",
            "duration": "35分钟",
            "cost": "约¥430"
          },
          "ticket": {
            "price": "Tokyo City View 成人约¥2200起",
            "reservation": true,
            "url": "https://tcv.roppongihills.com/"
          },
          "bestTime": "19:30-21:00，饭后直接看夜景，城市灯光最完整。",
          "tips": [
            "黄金周建议提前购票",
            "如天气差可改逛六本木Hills室内区域",
            "确认末班车和回酒店路线"
          ],
          "warning": {
            "level": "red",
            "text": "需提前购票：每月10日抢次月票"
          }
        }
      ]
    },
    {
      "id": 3,
      "date": "2026-05-04",
      "label": "Day 3",
      "note": "富士山与河口湖一日往返",
      "spots": [
        {
          "id": "d3s1",
          "name": "新宿高速巴士",
          "nameJa": "バスタ新宿",
          "icon": "🚌",
          "time": "07:30",
          "duration": 30,
          "lat": 35.6887,
          "lng": 139.7002,
          "category": "交通",
          "address": "5 Chome-24-55 Sendagaya, Shibuya City, Tokyo",
          "desc": "从新宿高速巴士总站出发前往河口湖，是富士山一日游最省心的方式。黄金周道路可能拥堵，务必提前到站。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚕 出租车或酒店接驳",
            "duration": "12分钟",
            "cost": "约¥1600"
          },
          "ticket": {
            "price": "单程约¥2200",
            "reservation": true,
            "url": "https://www.highwaybus.com/"
          },
          "bestTime": "07:30前到站，预留找站台和取票时间。",
          "tips": [
            "黄金周高速易堵",
            "建议提前买往返票",
            "带水和轻食"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：高速路况不可控"
          }
        },
        {
          "id": "d3s2",
          "name": "河口湖",
          "nameJa": "河口湖",
          "icon": "🗻",
          "time": "10:00",
          "duration": 150,
          "lat": 35.5171,
          "lng": 138.7518,
          "category": "自然",
          "address": "Fujikawaguchiko, Yamanashi",
          "desc": "河口湖是观赏富士山倒影和湖景的经典地点。天气好时湖畔步道和缆车区域都很适合拍照。",
          "transport": {
            "from": "新宿高速巴士",
            "method": "🚌 高速巴士",
            "duration": "约2小时",
            "cost": "约¥2200"
          },
          "ticket": {
            "price": "湖畔免费",
            "reservation": false,
            "url": "https://www.fujisan.ne.jp/"
          },
          "bestTime": "10:00-12:30，上午能见度通常更好。",
          "tips": [
            "天气变化快，带薄外套",
            "看富士山很吃云量",
            "湖边餐厅黄金周需排队"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：热门观景点拥挤"
          }
        },
        {
          "id": "d3s3",
          "name": "富士山五合目",
          "nameJa": "富士山五合目",
          "icon": "🌄",
          "time": "14:00",
          "duration": 90,
          "lat": 35.3949,
          "lng": 138.7327,
          "category": "自然",
          "address": "Narusawa, Minamitsuru District, Yamanashi",
          "desc": "富士山五合目可近距离感受山体与云海，海拔较高，气温明显低于东京。若天气或交通限制，可改在河口湖周边深度游。",
          "transport": {
            "from": "河口湖",
            "method": "🚌 登山巴士",
            "duration": "55分钟",
            "cost": "约¥1780"
          },
          "ticket": {
            "price": "区域免费，巴士另计",
            "reservation": false,
            "url": "https://www.fujisan-climb.jp/"
          },
          "bestTime": "14:00前后，视天气决定是否上山。",
          "tips": [
            "气温比东京低约10度",
            "山路可能限流或停运",
            "注意返程巴士末班时间"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：交通与天气需当天确认"
          }
        }
      ]
    },
    {
      "id": 4,
      "date": "2026-05-05",
      "label": "Day 4",
      "note": "半天城市散步，回新宿退房去机场",
      "spots": [
        {
          "id": "d4s1",
          "name": "明治神宫",
          "nameJa": "明治神宮",
          "icon": "🌲",
          "time": "09:00",
          "duration": 75,
          "lat": 35.6764,
          "lng": 139.6993,
          "category": "神社",
          "address": "1-1 Yoyogikamizonocho, Shibuya City, Tokyo",
          "desc": "东京市中心最静谧的神社森林，早上进入能避开大部分人潮。适合在离日前留出一段安静步行。",
          "transport": {
            "from": "柏悦酒店",
            "method": "🚇 大江户线 + 步行",
            "duration": "24分钟",
            "cost": "约¥220"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": "https://www.meijijingu.or.jp/"
          },
          "bestTime": "09:00-10:15，早间更清净。",
          "tips": [
            "参道碎石路较长",
            "主殿区域保持安静",
            "黄金周仍会逐渐变挤"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：5月5日为儿童节"
          }
        },
        {
          "id": "d4s2",
          "name": "表参道Hills",
          "nameJa": "表参道ヒルズ",
          "icon": "🛍",
          "time": "10:40",
          "duration": 60,
          "lat": 35.6674,
          "lng": 139.7086,
          "category": "购物",
          "address": "4 Chome-12-10 Jingumae, Shibuya City, Tokyo",
          "desc": "表参道的建筑与精品购物地标，适合短暂停留、买伴手礼或咖啡休息。动线紧凑，离涩谷不远。",
          "transport": {
            "from": "明治神宫",
            "method": "🚶 步行",
            "duration": "18分钟",
            "cost": "免费"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": "https://www.omotesandohills.com/"
          },
          "bestTime": "10:40-11:40，店铺陆续开门后刚好进入。",
          "tips": [
            "部分店11点开门",
            "退税需带护照",
            "控制购物时间避免影响退房"
          ],
          "warning": null
        },
        {
          "id": "d4s3",
          "name": "涩谷十字路口",
          "nameJa": "渋谷スクランブル交差点",
          "icon": "🚦",
          "time": "12:00",
          "duration": 35,
          "lat": 35.6595,
          "lng": 139.7005,
          "category": "地标",
          "address": "Shibuya Scramble Crossing, Tokyo",
          "desc": "东京最具辨识度的城市路口之一，适合快速拍照打卡。周边咖啡店可俯拍，但黄金周排队较久。",
          "transport": {
            "from": "表参道Hills",
            "method": "🚇 银座线或步行",
            "duration": "12分钟",
            "cost": "约¥180"
          },
          "ticket": {
            "price": "免费",
            "reservation": false,
            "url": ""
          },
          "bestTime": "12:00，午间人流充足且光线稳定。",
          "tips": [
            "注意红绿灯安全",
            "拍照不要停在路中间",
            "俯拍位可能排队"
          ],
          "warning": {
            "level": "yellow",
            "text": "黄金周注意：涩谷区域人流密集"
          }
        },
        {
          "id": "d4s4",
          "name": "新宿退房",
          "nameJa": "パークハイアット東京",
          "icon": "🧳",
          "time": "13:00",
          "duration": 45,
          "lat": 35.6856,
          "lng": 139.6907,
          "category": "酒店",
          "address": "Park Hyatt Tokyo, 3-7-1-2 Nishi Shinjuku, Tokyo",
          "desc": "返回柏悦酒店整理行李并退房。建议确认机场交通时间，黄金周车站与道路都可能拥挤。",
          "transport": {
            "from": "涩谷十字路口",
            "method": "🚃 JR山手线 + 出租车/步行",
            "duration": "25分钟",
            "cost": "约¥180起"
          },
          "ticket": {
            "price": "无",
            "reservation": false,
            "url": ""
          },
          "bestTime": "13:00前后，留足行李整理与交通缓冲。",
          "tips": [
            "检查护照和购物袋",
            "提前叫车或确认利木津巴士",
            "把机场时间倒推至少3小时"
          ],
          "warning": null
        },
        {
          "id": "d4s5",
          "name": "机场",
          "nameJa": "空港",
          "icon": "✈️",
          "time": "14:30",
          "duration": 120,
          "lat": 35.5494,
          "lng": 139.7798,
          "category": "交通",
          "address": "Tokyo International Airport / Narita Airport",
          "desc": "根据实际航班选择羽田或成田路线。黄金周返程客流高，建议更早抵达机场办理值机和退税。",
          "transport": {
            "from": "新宿退房",
            "method": "🚃 机场线/利木津巴士/出租车",
            "duration": "羽田约45-70分钟，成田约90-120分钟",
            "cost": "路线不同"
          },
          "ticket": {
            "price": "按交通方式",
            "reservation": false,
            "url": ""
          },
          "bestTime": "航班起飞前至少3小时到达。",
          "tips": [
            "确认出发机场是羽田还是成田",
            "退税和托运可能排队",
            "保留交通缓冲"
          ],
          "warning": null
        }
      ]
    }
  ]
};
