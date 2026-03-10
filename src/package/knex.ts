import setupKnex from 'knex'
import config from '../../knexfile'

export const knex = setupKnex(config)