import type { Course } from '../types'
import { dataAndDbms } from './01-data-and-dbms'
import { tablesAndRelationships } from './02-tables-and-relationships'
import { keysAndIntegrity } from './03-keys-and-integrity'
import { typesAndNull } from './04-types-and-null'
import { statementStructure } from './05-statement-structure'
import { clientServerTour } from './06-client-server-tour'

// Chapter 1 of SQL-COURSE-PLAN.md — COMPLETE: 6 of 6 sections, one scene each.
//
// Objective: Explain relational data and the basic form and context of SQL statements.
//
// Worked illustrations (from the plan): an annotated SQL statement; a client/server diagram; small
// customer and order tables showing keys, relationships, and NULL.
//
// Outcome: Explain tables, keys, NULL, basic statement syntax, and the distinction between a
// database server, a client, and SQL dialects.
//
// Bridge: We can describe relational data; next we translate business requirements into structures
// and enforceable rules.
//
// Notes: only the four core shop tables appear here (customers, products, orders, order items); the
// other four arrive when a chapter needs them. NULL is introduced in §4 and returns in chapter 4.
// Every query, result and error on a board is run by check:sql against PostgreSQL 16.
export const foundations: Course = {
  id: 'foundations',
  title: 'Database and SQL Foundations',
  sections: [dataAndDbms, tablesAndRelationships, keysAndIntegrity, typesAndNull, statementStructure, clientServerTour],
}
