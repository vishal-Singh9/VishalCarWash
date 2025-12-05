'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' };

export const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      (itemConfig.theme && itemConfig.theme[theme]) ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef((
  {
    active,
    payload,
    className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) => {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item.dataKey || item.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? (config[label]?.label || label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      ref={ref}
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                indicator === 'dot' && 'items-center'
              )}
            >
              {!hideIndicator && indicator === 'dot' && (
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: indicatorColor,
                  }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-8">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || key}
                  </span>
                  <span className="font-medium">
                    {formatter
                      ? formatter(item.value, item.dataKey, item, 0, item, 0)
                      : item.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef(
  ({ className, payload, formatter, ...props }, ref) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap justify-center gap-4', className)}
        {...props}
      >
        {payload.map((item, index) => {
          const itemConfig = getPayloadConfigFromPayload(
            config,
            item,
            item.value || item.dataKey
          );
          const color = item.color || item.payload.fill;

          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-1.5"
            >
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">
                {formatter
                  ? formatter(item.value, item.dataKey, item, 0, item, 0)
                  : itemConfig?.label || item.value || item.dataKey}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);

ChartLegendContent.displayName = 'ChartLegendContent';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config, payload, key) {
  if (!config || !key) {
    return null;
  }

  // Direct match
  if (config[key]) {
    return config[key];
  }

  // Check if the key is a string and try to find a match in the config
  if (typeof key === 'string') {
    // Try to match by the last part of the key (after last dot)
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];
    if (config[lastPart]) {
      return config[lastPart];
    }

    // Try to match by removing any prefix/suffix
    const configKey = Object.keys(config).find((k) =>
      key.toLowerCase().includes(k.toLowerCase())
    );
    if (configKey) {
      return config[configKey];
    }
  }

  // Check if payload has a name that matches a config key
  if (payload?.name && config[payload.name]) {
    return config[payload.name];
  }

  return null;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};

export const {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Surface,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} = RechartsPrimitive;
