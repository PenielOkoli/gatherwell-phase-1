import type { WorkshopInput, WorkshopPlan } from '@/types/domain';

// Pure domain function: called only after runtime validation at the server boundary.
export function buildAgenda(input: WorkshopInput): WorkshopPlan {
  const minutes = input.duration === 30 ? [3, 5, 10, 8, 4] : input.duration === 60 ? [5, 10, 20, 15, 10] : [10, 15, 30, 20, 15];
  const location = input.format === 'remote' ? 'a shared digital board' : 'sticky notes on a shared wall';
  const focus = {
    alignment: ['Map what matters', 'Choose a shared direction', 'Group priorities into themes. Discuss the tradeoffs and choose the three most important.'],
    ideas: ['Explore possibilities', 'Find the promising ideas', 'Write possible solutions individually. Group similar ideas and choose three to explore with a small experiment.'],
    retrospective: ['Look back honestly', 'Choose one improvement', 'Capture what helped, what got in the way, and what to try. Choose one change the team can test.'],
  }[input.kind];
  const activities = [
    ['Welcome & set the intention', `Read the goal aloud: “${input.goal}” Invite each person to share one word about what they hope to leave with. Offer the option to pass.`, 'A shared purpose'],
    ['Think quietly, then share', `Give everyone quiet time to write on ${location}. ${input.participants > 12 ? 'Share first in groups of three, then invite one observation per group.' : 'Go around the group, inviting one observation per person.'}`, 'Every perspective is heard'],
    [focus[0], `${focus[2]} Keep the conversation connected to your stated goal.`, 'A visible set of themes'],
    [focus[1], 'Give each participant three votes. Discuss the strongest options, check for concerns, and record the decision. If there is a tie, compare options against the goal.', 'A decision the group understands'],
    ['Close with a commitment', 'Write one next action, a volunteer owner, and a check-in date. Ask each person for a closing reflection. Share the notes after the session.', 'An owner and a next step'],
  ];
  return { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), sourceIds: ['participation', 'decisions', 'timeboxing'], steps: activities.map((a, i) => ({ id: `step-${i + 1}`, title: a[0], instruction: a[1], outcome: a[2], minutes: minutes[i] })) };
}
export function demoAnswer(question: string): string {
  if (/remote|online|virtual/i.test(question)) return 'For a remote session, share the agenda and board link in advance. Start with two minutes to check access. Use quiet writing before discussion, invite people by name without requiring them to speak, and keep the final commitment visible on the shared board.';
  if (/quiet|voice|particip|shy|inclus/i.test(question)) return 'Start with quiet individual reflection, then share in pairs before opening the whole-group discussion. Offer a written contribution or the option to pass. Invite a second perspective before returning to someone who has already spoken.';
  if (/time|short|minute|long/i.test(question)) return 'Keep the closing commitment intact. Reduce the number of discussion topics, use a visible timer, and place useful tangents in a parking lot. A focused 30-minute session with one clear decision is better than squeezing in every activity.';
  if (/decis|action|agree|vote/i.test(question)) return 'State the decision you need to make. Let everyone vote independently, discuss concerns, then name one action, its owner, and a check-in date. Record disagreement rather than assuming a vote means everyone agrees.';
  return 'Begin with one outcome your group can realistically achieve. Use the agenda to move from individual reflection to shared discussion, then close with a concrete next step. For more specific demo guidance, ask about remote sessions, participation, timeboxing, or decisions.';
}
