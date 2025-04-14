const {
  createDeal,
  getDealByMatchId,
  getUserDeals,
  updateDealStatus,
  getMessages,
  createMessage,
} = require('../models/deal.model')

// @route POST /api/deals
const proposeDeal = async (req, res, next) => {
  try {
    const { match_id, description } = req.body

    if (!match_id || !description) {
      return res.status(400).json({ success: false, message: 'match_id and description are required' })
    }

    const deal = await createDeal(match_id, req.user.id, description)
    res.status(201).json({ success: true, deal })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/deals
const getMyDeals = async (req, res, next) => {
  try {
    const deals = await getUserDeals(req.user.id)
    res.status(200).json({ success: true, deals })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/deals/match/:match_id
const getDealForMatch = async (req, res, next) => {
  try {
    const deal = await getDealByMatchId(req.params.match_id)
    res.status(200).json({ success: true, deal: deal || null })
  } catch (err) {
    next(err)
  }
}

// @route PATCH /api/deals/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['accepted', 'declined', 'completed', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const deal = await updateDealStatus(req.params.id, status)
    res.status(200).json({ success: true, deal })
  } catch (err) {
    next(err)
  }
}

// @route GET /api/deals/:id/messages
const fetchMessages = async (req, res, next) => {
  try {
    const messages = await getMessages(req.params.id)
    res.status(200).json({ success: true, messages })
  } catch (err) {
    next(err)
  }
}

// @route POST /api/deals/:id/messages
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' })
    }

    const message = await createMessage(req.params.id, req.user.id, content.trim())
    res.status(201).json({ success: true, message })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  proposeDeal,
  getMyDeals,
  getDealForMatch,
  updateStatus,
  fetchMessages,
  sendMessage,
}