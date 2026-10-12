import type { Course } from '../types'
import { rolesOwnership } from './01-roles-ownership'
import { grantRevoke } from './02-grant-revoke'
import { roleHierarchies } from './03-role-hierarchies'
import { viewsPolicies } from './04-views-policies'
import { parametersBoundaries } from './05-parameters-boundaries'
import { integratedCase } from './06-integrated-case'

// Chapter 10 of SQL-COURSE-PLAN.md — COMPLETE: 6 of 6 sections, one scene each. The course is complete: 79 of 79.
//
// Objective: Explain access boundaries and connect the complete database lifecycle through a worked case.
//
// Worked illustrations (from the plan): GRANT/REVOKE examples and a permission matrix; a view and
// row-policy comparison; parameterised-query examples; an integrated shop-database walkthrough.
//
// Outcome: Interpret a permission matrix, explain query parameterisation boundaries, and justify design
// choices throughout the narrated shop case.
//
// Bridge: Continue exploring unfamiliar queries, documented engine differences, and failure cases;
// practical competence requires separate implementation experience.
//
// Notes: roles are cluster-wide, but every snippet creates its roles inside the runner's rolled-back
// transaction, so none survive; SET ROLE makes the privilege checks real for a superuser runner. Permission
// matrices are has_table_privilege() output. Authentication (pg_hba, passwords) is described, not run.
// Facts no card shows (the unqualified-name message, security_invoker views, DROP needing ownership, NULL-employee
// orders matching no policy) are asserted in db/verify/ch10-access.sql. The closing narration does not
// claim that the learner is competent.
export const access: Course = {
  id: 'access',
  title: 'Access Control and Integrated Reasoning',
  sections: [rolesOwnership, grantRevoke, roleHierarchies, viewsPolicies, parametersBoundaries, integratedCase],
}
