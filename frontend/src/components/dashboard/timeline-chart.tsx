import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", value: 10 },
  { time: "01:00", value: 8 },
  { time: "02:00", value: 5 },
  { time: "03:00", value: 3 },
  { time: "04:00", value: 2 },
  { time: "05:00", value: 5 },
  { time: "06:00", value: 8 },
  { time: "07:00", value: 12 },
  { time: "08:00", value: 15 },
  { time: "09:00", value: 20 },
  { time: "10:00", value: 25 },
  { time: "11:00", value: 22 },
  { time: "12:00", value: 18 },
  { time: "13:00", value: 20 },
  { time: "14:00", value: 23 },
  { time: "15:00", value: 25 },
  { time: "16:00", value: 22 },
  { time: "17:00", value: 18 },
  { time: "18:00", value: 15 },
  { time: "19:00", value: 12 },
  { time: "20:00", value: 10 },
  { time: "21:00", value: 8 },
  { time: "22:00", value: 5 },
  { time: "23:00", value: 3 },
]

export function TimelineChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Time
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].payload.time}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Activity
                        </span>
                        <span className="font-bold">{payload[0].value}%</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}