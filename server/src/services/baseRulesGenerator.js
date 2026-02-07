/**
 * Generate base rules as simple markdown bullets from process/permissions answers.
 * Used for new schema answers: ai_permissions, always_ask_before, git_behavior, etc.
 */

const LABELS = {
  ai_permissions: 'AI may',
  always_ask_before: 'Always ask before',
  git_behavior: 'Git',
  when_run_checks: 'Run checks',
  failure_policy: 'On failure',
  documentation_expectations: 'Documentation',
  security_posture: 'Security',
  output_preference: 'Output style',
  uncertainty_handling: 'When uncertain',
};

const VALUE_LABELS = {
  ai_permissions: {
    create_files: 'create new files',
    edit_files: 'edit existing files',
    refactor_multi_module: 'refactor across multiple modules',
    run_commands: 'run terminal commands',
    install_deps: 'install dependencies',
    update_lockfiles: 'update lockfiles',
    update_ci_config: 'update CI/config files',
  },
  always_ask_before: {
    add_dependencies: 'adding dependencies',
    db_migrations_schema_changes: 'DB migrations or schema changes',
    auth_security_sensitive_changes: 'auth or security-sensitive changes',
    delete_files: 'deleting files',
    public_api_changes: 'public API changes',
    ci_deploy_config_changes: 'CI or deploy config changes',
    none: 'none (proceed without asking)',
  },
  git_behavior: {
    never_push_never_pr: 'never push or open PRs',
    prepare_commits_locally: 'prepare commits locally only',
    push_when_asked: 'push when asked',
    push_and_open_pr_when_asked: 'push and open PR when asked',
  },
  when_run_checks: {
    never_unless_asked: 'never unless asked',
    after_meaningful_changes: 'after meaningful changes',
    before_final_answer: 'before final answer',
    before_commit_pr: 'before commit/PR',
  },
  failure_policy: {
    fix_automatically: 'fix automatically',
    stop_and_ask: 'stop and ask',
    explain_and_propose: 'explain and propose fix',
  },
  documentation_expectations: {
    dont_touch_unless_asked: "don't touch unless asked",
    update_when_behavior_changes: 'update when behavior changes',
    docs_first_class_proactive: 'treat docs as first-class; update proactively',
  },
  security_posture: {
    standard: 'standard precautions',
    high_sensitivity_conservative: 'high sensitivity; conservative',
    security_focused_always_checks: 'security-focused; always run checks',
  },
  output_preference: {
    code_only: 'code only',
    plan_then_code: 'plan then code',
    code_plus_brief: 'code plus brief explanation',
    verbose_explanation: 'verbose explanation',
  },
  uncertainty_handling: {
    ask_before_proceeding: 'ask before proceeding',
    best_assumption_continue: 'make best assumption and continue',
    ask_one_question_then_proceed: 'ask one question then proceed',
  },
};

/**
 * @param {object} answers - New schema answers
 * @returns {string} Markdown section for base rules
 */
export function generateBaseRules(answers) {
  if (!answers) return '';

  const bullets = [];
  const keys = [
    'ai_permissions',
    'always_ask_before',
    'git_behavior',
    'when_run_checks',
    'failure_policy',
    'documentation_expectations',
    'security_posture',
    'output_preference',
    'uncertainty_handling',
  ];

  for (const key of keys) {
    const val = answers[key];
    const label = LABELS[key];
    if (label == null) continue;
    if (Array.isArray(val) && val.length > 0) {
      const items = val
        .map((v) => VALUE_LABELS[key]?.[v] ?? v)
        .filter(Boolean);
      if (items.length) bullets.push(`- **${label}:** ${items.join('; ')}.`);
    } else if (val != null && val !== '' && VALUE_LABELS[key]?.[val] != null) {
      bullets.push(`- **${label}:** ${VALUE_LABELS[key][val]}.`);
    } else if (val != null && val !== '') {
      bullets.push(`- **${label}:** ${val}.`);
    }
  }

  if (bullets.length === 0) return '';
  return '# Base rules\n\n' + bullets.join('\n') + '\n';
}
