import { useState } from 'react';

const NotificationItem = ({ title, content }: { title: string, content: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors px-2 rounded cursor-pointer group"
      >
        <div className="flex items-center">
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm font-medium mr-3 shrink-0">
            [公告]
          </span>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h3>
        </div>
        <span className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="text-gray-600 text-sm leading-relaxed pl-4 pb-6 text-left animate-in fade-in slide-in-from-top-1 duration-200">
          {content.map((line, idx) => (
            <p key={idx} className="mb-1 break-words">
              {line.startsWith('http') ? (
                <a href={line} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {line}
                </a>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export const NotificationsPage = () => {
  const notifications = [
    {
      title: "天梯赛备赛宣讲及本学期最后一次训练",
      content: [
        "时间：2025年12月20日(本周六) 14：00-17：30",
        "地点：X30337",
        "安排：",
        "14：00-14：25 天梯赛赛制介绍及备赛建议",
        "14：30-17：30 天梯赛模拟体验",
        "该项比赛为我校算法竞赛系列中成绩最为亮眼，最容易拿国奖的比赛。",
        "25年1队国一，2队国二",
        "24年1队国一，1队国二，1队国三",
        "赛程安排：",
        "普及赛报名截止：2026年3月7日",
        "普及赛竞赛时间：2026年3月14日13：30-15：30",
        "ps.普及赛成绩和校队选拔成绩会成为选拔我校全国总决赛队员共30人的主要依据",
        "总决赛竞赛时间：2026年4月18日13：30-16：30"
      ]
    },
    {
      title: "新秀杯培训第五场通知",
      content: [
        "时间：12.4(周四)晚19：30",
        "地点：X2334",
        "内容：数学",
        "报名链接：https://docs.qq.com/form/page/DQW1jdGFWeEV5eVBi#/fill"
      ]
    },
    {
      title: "新秀杯",
      content: [
        "亲爱的同学们，2025年西南交大ACM程序设计新秀杯开展计划如下",
        "新秀杯初赛定于11月29号线上举行，决赛定于12月7号线下举行。",
        "本场比赛为ACM-ICPC赛制下的个人赛，比赛成绩将按比例计入25-26学年西南交大ACM校集训队选拔分数。",
        "以下是新秀杯的简略信息：",
        "初赛",
        ">>日期：11月29日（周六）",
        ">>时间：12：30 - 17：30",
        ">>地点：宿舍，图书馆等",
        "决赛",
        ">>日期：12月7日（周日）",
        ">>时间：12：30 - 17：30",
        ">>地点：机房X7507",
        ">>报名链接：",
        "【腾讯文档】2025年西南交通大学ACM新秀杯报名表",
        "https://docs.qq.com/form/page/DUm9JVHh1S3NZd1dP",
        "历年的ACM新秀杯题目已经上传西南交大ACM校Online Judging平台",
        "平台链接：https://oj.swjtu.edu.cn/",
        "同学们可以先行注册，尝试历年题目并适应该平台。",
        "注册提醒>>建议同学们注册账号时用自己的学号做昵称",
        "赛前公告：https://docs.qq.com/doc/DQWNQckdnU3pKVWFT?dver="
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg p-8 shadow-md min-h-[400px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">📢 消息通知</h2>
      <p className="text-gray-500 text-sm mb-6">点击标题查看详情</p>
      <div className="space-y-2">
        {notifications.map((item, i) => (
          <NotificationItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
};
