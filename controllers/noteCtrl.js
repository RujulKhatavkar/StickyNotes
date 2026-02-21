const Notes = require('../models/noteModel')

function normalizeTags(input) {
    // Accepts: array of strings OR a single string like "work, study #personal"
    if (!input) return [];

    const raw = Array.isArray(input) ? input : String(input).split(/[,#\n]+/g);
    const cleaned = raw
        .map(t => String(t).trim())
        .filter(Boolean)
        .map(t => t.replace(/^#/, '').trim())
        .filter(Boolean)
        .map(t => t.toLowerCase());

    // de-dupe + limit
    return Array.from(new Set(cleaned)).slice(0, 20);
}

const noteCtrl = {
    getNotes: async (req, res) =>{
        try {
            const { q, tag, tags } = req.query;

            const filter = { user_id: req.user.id };

            // text search (title/content)
            if (q && String(q).trim()) {
                const query = String(q).trim();
                const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                filter.$or = [{ title: re }, { content: re }];
            }

            // tag filtering
            // - tag=work (single)
            // - tags=work,study (all selected tags)
            if (tags && String(tags).trim()) {
                const list = normalizeTags(tags);
                if (list.length) filter.tags = { $all: list };
            } else if (tag && String(tag).trim()) {
                filter.tags = String(tag).trim().toLowerCase();
            }

            const notes = await Notes.find(filter).sort({ updatedAt: -1 })
            res.json(notes)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createNote: async(req, res) =>{
        try {
            const {title, content, date, tags} = req.body;

            if (!title || !content) {
                return res.status(400).json({ msg: 'Title and content are required.' })
            }

            const newNote = new Notes({
                title,
                content,
                date,
                tags: normalizeTags(tags),
                user_id: req.user.id,
                name: req.user.name
            })
            await newNote.save()
            res.json({msg: "Created a Note"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteNote: async(req, res) =>{
        try {
            await Notes.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Note"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateNote: async(req, res) =>{
        try {
            const {title, content, date, tags} = req.body;

            if (!title || !content) {
                return res.status(400).json({ msg: 'Title and content are required.' })
            }

            await Notes.findOneAndUpdate({_id: req.params.id},{
                title,
                content,
                date,
                tags: normalizeTags(tags)
            })
            res.json({msg: "Updated a Note"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNote: async(req, res) => {
        try {
            const note = await Notes.findById(req.params.id)
            res.json(note)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = noteCtrl