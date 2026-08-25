import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Cpu,
  Mic,
  Eye,
  Sparkles,
  Radio,
  Brain,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { SwarmAgent, SwarmClusterId } from '../types';
import { SWARM_CLUSTERS, INITIAL_SWARM_AGENTS } from '../data/swarmAgentsData';
import { playRotaryClickSound } from '../utils/audioSynthesizer';

interface SwarmMatrixViewProps {
  onTriggerAgentAction: (agentId: number, taskName: string) => void;
  onRunGlobalSwarmBoost: () => void;
}

export const SwarmMatrixView: React.FC<SwarmMatrixViewProps> = ({
  onTriggerAgentAction,
  onRunGlobalSwarmBoost,
}) => {
  const [agents, setAgents] = useState<SwarmAgent[]>(INITIAL_SWARM_AGENTS);
  const [selectedCluster, setSelectedCluster] = useState<SwarmClusterId | 'all'>('all');
  const [isSwarmBoosting, setIsSwarmBoosting] = useState(false);
  const [liveLogStream, setLiveLogStream] = useState<string[]>([
    '[SWARM-COORDINATOR] Initializing 30-agent parallel execution matrix on MediaTek MT6765...',
    '[AGENT-01..05] Voice DSP & WebSocket Live Pipeline: 16kHz PCM streaming synchronized.',
    '[AGENT-06..10] MS35774 Stepper Motor & Optical OCR Pipeline: Stepper angle linked.',
    '[AGENT-11..15] Spark Micro-App Sandbox: Rotary bridge listener armed at 60 FPS.',
    '[AGENT-16..20] Ad-Free Audio Engine: InnerTube headless stream demuxer ready.',
    '[AGENT-21..25] Memory & Persona Engine: Nightly WorkManager distillation active.',
    '[AGENT-26..30] Kernel, SoC & Kiosk: 41°C schedutil governor & hardware PTT pinned.',
    '[SWARM-30] All 30 specialized agents online and operating at maximum throughput.',
  ]);

  // Periodic simulated agent background tick
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          const deltaTasks = Math.floor(Math.random() * 3) + 1;
          const latencyJitter = Math.max(2, agent.latencyMs + Math.floor(Math.random() * 5 - 2));
          return {
            ...agent,
            tasksCompleted: agent.tasksCompleted + deltaTasks,
            latencyMs: latencyJitter,
            metrics: {
              ...agent.metrics,
              tps: Math.max(10, agent.metrics.tps + Math.floor(Math.random() * 11 - 5)),
            },
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRunGlobalBoost = () => {
    setIsSwarmBoosting(true);
    playRotaryClickSound();
    onRunGlobalSwarmBoost();

    setLiveLogStream((prev) => [
      ...prev.slice(-25),
      `⚡ [SWARM-OVERDRIVE] User triggered 30-Agent Parallel Speed Boost at ${new Date().toLocaleTimeString()}!`,
    ]);

    // Animate all 30 agents to 100% progress and optimize latency
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'optimizing',
        progress: 100,
        latencyMs: Math.max(2, Math.floor(a.latencyMs * 0.45)),
        metrics: {
          ...a.metrics,
          tps: Math.floor(a.metrics.tps * 1.8),
          efficiency: 99.9,
        },
      }))
    );

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'active',
        }))
      );
      setIsSwarmBoosting(false);
      setLiveLogStream((prev) => [
        ...prev.slice(-25),
        `✅ [SWARM-OVERDRIVE] All 30 agents optimized. System latency reduced by 55%, throughput +80%.`,
      ]);
    }, 1800);
  };

  const handleAgentClick = (agent: SwarmAgent) => {
    playRotaryClickSound();
    onTriggerAgentAction(agent.id, agent.currentTask);
    setLiveLogStream((prev) => [
      ...prev.slice(-25),
      `[DISPATCH] Agent ${agent.code} (${agent.name}): Executing direct priority task -> "${agent.currentTask}"`,
    ]);

    setAgents((prev) =>
      prev.map((a) =>
        a.id === agent.id
          ? {
              ...a,
              tasksCompleted: a.tasksCompleted + 10,
              progress: 100,
              lastLog: `[${agent.code}] Manual execution triggered: task optimized instantly.`,
            }
          : a
      )
    );
  };

  const filteredAgents =
    selectedCluster === 'all' ? agents : agents.filter((a) => a.cluster === selectedCluster);

  const totalCompletedTasks = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const avgLatency = Math.round(agents.reduce((acc, a) => acc + a.latencyMs, 0) / agents.length);
  const totalTps = agents.reduce((acc, a) => acc + a.metrics.tps, 0);

  return (
    <div className="space-y-4 max-w-5xl">
      {/* 1. Header with Global Swarm Stats & Speed Boost Button */}
      <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="font-bold text-base text-stone-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              30-Agent Parallel Swarm Matrix
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              30/30 Online
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Simultaneously orchestrating 30 specialized background micro-agents across DSP voice streaming,
            stepper motor mechanics, Spark micro-apps, ad-free music, persistent memory, and SoC kernel scheduling.
          </p>
        </div>

        {/* Big Action Button */}
        <button
          id="btn_run_30_agents_boost"
          onClick={handleRunGlobalBoost}
          disabled={isSwarmBoosting}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 active:scale-95 disabled:opacity-50 text-black font-black font-mono text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Zap className={`w-4 h-4 ${isSwarmBoosting ? 'animate-spin' : ''}`} />
          {isSwarmBoosting ? 'Optimizing 30 Agents...' : 'Run 30-Agent Full Speed Boost'}
        </button>
      </div>

      {/* 2. Global Telemetry Badges (4 metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
          <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> Active Agents
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">30 / 30</div>
          <div className="text-[10px] text-stone-500">6 Parallel Clusters</div>
        </div>

        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
          <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" /> Swarm Throughput
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
            {totalTps.toLocaleString()} ops/s
          </div>
          <div className="text-[10px] text-stone-500">{totalCompletedTasks.toLocaleString()} tasks total</div>
        </div>

        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
          <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Mean Latency
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{avgLatency} ms</div>
          <div className="text-[10px] text-stone-500">Sub-second stream</div>
        </div>

        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
          <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" /> Swarm Health
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">99.8%</div>
          <div className="text-[10px] text-stone-500">Zero packet drops</div>
        </div>
      </div>

      {/* 3. Cluster Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCluster('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 shrink-0 ${
            selectedCluster === 'all'
              ? 'bg-stone-100 text-stone-950 font-bold shadow'
              : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <span>All 30 Agents</span>
          <span className="text-[10px] px-1 rounded bg-stone-800 text-stone-300">30</span>
        </button>

        {Object.values(SWARM_CLUSTERS).map((cluster) => {
          const count = agents.filter((a) => a.cluster === cluster.id).length;
          return (
            <button
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedCluster === cluster.id
                  ? 'text-white font-bold shadow'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
              style={{
                borderColor: selectedCluster === cluster.id ? cluster.color : undefined,
                backgroundColor: selectedCluster === cluster.id ? `${cluster.color}25` : undefined,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cluster.color }} />
              <span>{cluster.name.split(' ')[0]}</span>
              <span className="text-[10px] text-stone-400">[{count}]</span>
            </button>
          );
        })}
      </div>

      {/* 4. Agents Matrix Grid (30 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredAgents.map((agent) => {
          const clusterMeta = SWARM_CLUSTERS[agent.cluster];
          return (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className="p-3 bg-stone-950 rounded-xl border border-stone-800/90 hover:border-stone-600 transition-all cursor-pointer flex flex-col justify-between group shadow-sm relative overflow-hidden"
            >
              {/* Top Row: Code + Name + Status */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
                      style={{
                        backgroundColor: `${clusterMeta.color}20`,
                        color: clusterMeta.color,
                        border: `1px solid ${clusterMeta.color}40`,
                      }}
                    >
                      {agent.code}
                    </span>
                    <span className="font-bold text-xs text-stone-200 group-hover:text-white transition-colors">
                      {agent.name}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {agent.latencyMs}ms
                  </span>
                </div>

                <div className="text-[11px] text-stone-400 font-sans line-clamp-1 mb-1.5">
                  {agent.role}
                </div>

                {/* Current Active Task */}
                <div className="p-1.5 rounded bg-stone-900/80 border border-stone-800 text-[10px] text-stone-300 font-mono line-clamp-2 leading-relaxed">
                  {agent.currentTask}
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="mt-2.5 pt-2 border-t border-stone-900 flex items-center justify-between text-[10px] font-mono text-stone-400">
                <span>{agent.metrics.tps} ops/s</span>
                <span>{agent.tasksCompleted} tasks</span>
                <span className="text-emerald-400">{agent.metrics.efficiency}% eff</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Live Swarm Orchestration Log Stream */}
      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2 text-[10px] text-stone-500">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Terminal className="w-3 h-3 text-emerald-400" />
            30-AGENT COORDINATOR TELEMETRY LOG
          </span>
          <span className="text-emerald-400">● 30 ACTIVE THREADS</span>
        </div>
        <div className="h-28 overflow-y-auto space-y-1 text-stone-300 pr-1 select-text">
          {liveLogStream.map((log, idx) => (
            <div key={idx} className="leading-tight text-[11px]">
              <span className="text-stone-600 mr-2">{new Date().toLocaleTimeString()}</span>
              <span
                className={
                  log.includes('[SWARM-OVERDRIVE]') || log.includes('⚡')
                    ? 'text-emerald-300 font-bold'
                    : log.includes('[DISPATCH]')
                    ? 'text-cyan-300'
                    : log.includes('AGENT-01') || log.includes('DSP')
                    ? 'text-cyan-400'
                    : log.includes('AGENT-06') || log.includes('CAM')
                    ? 'text-amber-400'
                    : log.includes('AGENT-11') || log.includes('SPK')
                    ? 'text-emerald-400'
                    : log.includes('AGENT-16') || log.includes('AUD')
                    ? 'text-rose-400'
                    : 'text-stone-300'
                }
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
