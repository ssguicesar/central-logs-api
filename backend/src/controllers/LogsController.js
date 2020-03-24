const { Log } = require('../models')
const { schemaValidationForLogs } = require('../utils/validators')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const { locals: id } = req
      const { params: { senderApplication } } = req
      const logs = await Log.findAll({
        where: { UserId: id, senderApplication }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(200).json({ message: 'There are no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByEnvironment: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { environment } } = req

      const logs = await Log.findAll({
        where: { UserId, environment }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(200).json({ message: 'There are no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByLevel: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { level } } = req

      const logs = await Log.findAll({
        where: { UserId, level }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(200).json({ message: 'There are no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  create: async (req, res) => {
    try {
      const { locals: id } = req
      const { body } = req
      const isValidSchemaLog = await schemaValidationForLogs(body)

      if (!isValidSchemaLog) {
        return res.status(406).json({ message: 'Invalid data' })
      }

      const result = await Log.create({
        ...body,
        UserId: id
      })

      return res.status(200).json({ result })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  restoreById: async (req, res) => {
    try {
      const { params: { id } } = req
      const isLogFound = await Log.findOne({
        where: { id },
        paranoid: false
      })

      if (!isLogFound) {
        return res.status(200).json({ message: 'There is no log' })
      }

      await Log.restore()

      return res.status(200).json({ message: 'Log restored successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  restoreAllByUser: async (req, res) => {
    const { locals: { UserId } } = req

    const logs = await Log.findAll({
      where: { UserId },
      paranoid: false
    })

    const hasLogs = logs.length
    if (!hasLogs) {
      return res.status(200).json({ message: 'There are no logs' })
    }

    await Log.restore({
      where: { UserId }
    })

    return res.status(200).json({ message: 'All logs restored successfully' })
  },

  deleteById: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { UserId, id }
      })

      if (!logExist) {
        return res.status(200).json({ message: 'There is no log' })
      }

      await Log.destroy({
        where: { id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteAllByUser: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const logs = await Log.findAll({
        where: { UserId }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(200).json({ message: 'There are no logs' })
      }

      await Log.destroy({
        where: { UserId }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteById: async (req, res) => {
    try {
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { id }
      })

      if (!logExist) {
        return res.status(200).json({ message: 'There is no log' })
      }

      await Log.destroy({
        where: { id },
        force: true
      })

      return res.status(200).json({ message: 'Deleted successfully, this action cannot be undone' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteAllByUser: async (req, res) => {
    try {
      const { locals: { UserId } } = req

      const logs = await Log.findAll({
        where: { UserId }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(200).json({ message: 'There are no logs' })
      }

      await Log.destroy({
        where: { UserId },
        force: true
      })

      return res.status(200).json({ message: 'Deleted successfully, this action cannot be undone' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
