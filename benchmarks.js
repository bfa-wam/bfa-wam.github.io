// Success rates are transcribed from the three main benchmark tables.
// The last score in each row is the aggregate reported in the paper.
const benchmarks = {
  plus: {
    name: "LIBERO-Plus",
    title: "Robustness across seven shifts",
    context: "Success rate (%) on perturbed versions of the LIBERO tasks.",
    conditions: ["Camera viewpoint", "Robot initial state", "Language", "Lighting", "Background", "Sensor noise", "Object layout"],
    aggregate: "Overall",
    note: "BFA-WAM and the reproduced Fast-WAM aggregate successes over all 10,030 rollouts. Other aggregate scores are taken from the respective publications.",
    rows: [
      { name: "OpenVLA", pretrained: true, scores: [0.8, 3.5, 23.0, 8.1, 34.8, 15.2, 28.5, 15.6] },
      { name: "OpenVLA-OFT", pretrained: true, scores: [56.4, 31.9, 79.5, 88.7, 93.3, 75.8, 74.2, 69.6] },
      { name: "π₀", pretrained: true, scores: [13.8, 6.0, 58.8, 85.0, 81.4, 79.0, 68.9, 53.6] },
      { name: "π₀-FAST", pretrained: true, scores: [65.1, 21.6, 61.0, 73.2, 73.2, 74.4, 68.8, 61.6] },
      { name: "UniVLA", pretrained: true, scores: [1.8, 46.2, 69.6, 69.0, 81.0, 21.2, 31.9, 42.9] },
      { name: "WorldVLA", pretrained: true, scores: [0.1, 27.9, 41.6, 43.7, 17.1, 10.9, 38.0, 25.0] },
      { name: "Fast-WAM", pretrained: false, scores: [19.6, 46.0, 71.3, 81.5, 47.6, 31.1, 60.0, 49.5] },
      { name: "ForeWAM", pretrained: false, scores: [61.7, 56.8, 85.1, 95.8, 76.5, 89.1, 83.0, 77.6] },
      { name: "Faster-WAM", pretrained: false, scores: [53.8, 71.6, 94.7, 96.3, 61.3, 63.6, 79.1, 73.6] },
      { name: "BFA-WAM", pretrained: false, scores: [60.4, 80.8, 93.4, 96.9, 82.7, 78.2, 80.5, 81.1] }
    ]
  },
  libero: {
    name: "LIBERO",
    title: "Success across four task suites",
    context: "Success rate (%) across ten tasks per suite, with 50 trials per task for BFA-WAM.",
    conditions: ["Spatial", "Object", "Goal", "Long"],
    aggregate: "Mean",
    note: "The aggregate is the mean of the four suite success rates.",
    rows: [
      { name: "OpenVLA", pretrained: true, scores: [84.7, 88.4, 79.2, 53.7, 76.5] },
      { name: "WorldVLA", pretrained: true, scores: [87.6, 96.2, 83.4, 60.0, 81.8] },
      { name: "π₀-FAST", pretrained: true, scores: [96.4, 96.8, 88.6, 60.2, 85.5] },
      { name: "π₀", pretrained: true, scores: [96.8, 98.8, 95.8, 85.2, 94.1] },
      { name: "UniVLA", pretrained: true, scores: [96.5, 96.8, 95.6, 92.0, 95.2] },
      { name: "π₀.₅", pretrained: true, scores: [98.8, 98.2, 98.0, 92.4, 96.9] },
      { name: "CogVLA", pretrained: true, scores: [98.6, 98.8, 96.6, 95.4, 97.4] },
      { name: "Motus", pretrained: true, scores: [96.8, 99.8, 96.6, 97.6, 97.7] },
      { name: "LingBot-VA", pretrained: true, scores: [98.5, 99.6, 97.2, 98.5, 98.5] },
      { name: "Fast-WAM", pretrained: false, scores: [98.2, 100.0, 97.0, 95.2, 97.6] },
      { name: "Fast-WAM-Joint", pretrained: false, scores: [99.6, 99.4, 98.2, 96.8, 98.5] },
      { name: "ForeWAM", pretrained: false, scores: [97.6, 99.8, 98.0, 96.2, 97.9] },
      { name: "BFA-WAM", pretrained: false, scores: [99.4, 99.8, 98.2, 98.4, 99.0] }
    ]
  },
  robotwin: {
    name: "RoboTwin 2.0",
    title: "Bimanual manipulation across 50 tasks",
    context: "Task-averaged success rate (%) in clean and randomized scenes.",
    conditions: ["Clean", "Randomized"],
    aggregate: "Mean",
    note: "Each task is evaluated over 100 trials per setting with held-out instructions. Randomization covers backgrounds, clutter, lighting, and table height.",
    rows: [
      { name: "π₀", pretrained: true, scores: [65.9, 58.4, 62.2] },
      { name: "π₀.₅", pretrained: true, scores: [82.7, 76.8, 79.8] },
      { name: "Motus", pretrained: true, scores: [88.7, 87.0, 87.8] },
      { name: "Motus (Wan2.2 init.)", pretrained: false, scores: [77.6, 77.0, 77.3] },
      { name: "LingBot-VA", pretrained: true, scores: [92.9, 91.5, 92.2] },
      { name: "Fast-WAM", pretrained: false, scores: [91.9, 91.8, 91.8] },
      { name: "Fast-WAM-Joint", pretrained: false, scores: [90.8, 90.3, 90.6] },
      { name: "FlowWAM", pretrained: true, scores: [92.9, 92.1, 92.5] },
      { name: "Faster-WAM", pretrained: false, scores: [92.8, 92.3, 92.6] },
      { name: "BFA-WAM", pretrained: false, scores: [93.4, 93.6, 93.5] }
    ]
  }
};
