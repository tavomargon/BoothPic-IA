// backend/src/api/admin/controllers/TemplateController.js

import Template from '../../../models/Template.js';
import { uploadToStorage } from '../../../services/StorageService.js';
import { validateFile } from '../../../utils/validation.js';
import sharp from 'sharp';

const TEMPLATE_SPECS = {
  backgrounds: {
    minResolution: { width: 1920, height: 1080 },
    maxResolution: { width: 3840, height: 2160 },
    formats: ['jpeg', 'png', 'webp'],
    maxSize: 15 * 1024 * 1024, // 15MB
    aspectRatios: ['16:9', '4:3', '1:1']
  },
  frames: {
    minResolution: { width: 512, height: 512 },
    maxResolution: { width: 4096, height: 4096 },
    formats: ['png', 'webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    aspectRatios: ['16:9', '4:3', '1:1', '9:16', '3:2'],
    requiresTransparency: true
  },
  stickers: {
    minResolution: { width: 256, height: 256 },
    maxResolution: { width: 2048, height: 2048 },
    formats: ['png', 'webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    requiresTransparency: true
  }
};

class TemplateController {
  /**
   * Obtener fondos
   */
  static async getBackgrounds(req, res) {
    try {
      const { page = 1, limit = 20, category = null } = req.query;
      const offset = (page - 1) * limit;

      const where = { type: 'BACKGROUND' };
      if (category) where.category = category;

      const { count, rows } = await Template.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit) }
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'BACKGROUNDS_ERROR', message: error.message } });
    }
  }

  /**
   * Subir fondo
   */
  static async uploadBackground(req, res) {
    try {
      const { title, description, category, tags = [] } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ 
          error: { code: 'NO_FILE', message: 'Archivo requerido' } 
        });
      }

      // Validar archivo
      const validation = await validateFile(file, TEMPLATE_SPECS.backgrounds);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: { code: 'INVALID_FILE', message: validation.error } 
        });
      }

      // Obtener dimensiones
      const metadata = await sharp(file.buffer).metadata();

      // Subir a almacenamiento
      const uploadPath = `templates/backgrounds/${Date.now()}-${file.originalname}`;
      const { url } = await uploadToStorage(file.buffer, uploadPath, file.mimetype);

      // Crear thumbnail
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(400, 225, { fit: 'cover' })
        .webp()
        .toBuffer();

      const thumbnailPath = `templates/backgrounds/thumbnails/${Date.now()}-thumb.webp`;
      const { url: thumbnailUrl } = await uploadToStorage(thumbnailBuffer, thumbnailPath, 'image/webp');

      // Guardar en BD
      const template = await Template.create({
        type: 'BACKGROUND',
        title,
        description,
        category,
        url,
        thumbnailUrl,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        fileSize: file.size,
        tags: tags.join(','),
        specs: TEMPLATE_SPECS.backgrounds,
        uploadedBy: req.user.id
      });

      res.status(201).json({
        message: 'Fondo subido exitosamente',
        data: template
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'UPLOAD_ERROR', message: error.message } });
    }
  }

  /**
   * Actualizar fondo
   */
  static async updateBackground(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, tags, isActive } = req.body;

      const template = await Template.findByPk(id);

      if (!template) {
        return res.status(404).json({ 
          error: { code: 'TEMPLATE_NOT_FOUND', message: 'Plantilla no encontrada' } 
        });
      }

      await template.update({
        title,
        description,
        category,
        tags: tags?.join(','),
        isActive
      });

      res.json({
        message: 'Fondo actualizado',
        data: template
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  /**
   * Eliminar fondo
   */
  static async deleteBackground(req, res) {
    try {
      const { id } = req.params;

      const template = await Template.findByPk(id);

      if (!template) {
        return res.status(404).json({ 
          error: { code: 'TEMPLATE_NOT_FOUND', message: 'Plantilla no encontrada' } 
        });
      }

      await template.destroy();

      res.json({ message: 'Fondo eliminado' });
    } catch (error) {
      res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }

  /**
   * Obtener stickers
   */
  static async getStickers(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Template.findAndCountAll({
        where: { type: 'STICKER' },
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit) }
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'STICKERS_ERROR', message: error.message } });
    }
  }

  /**
   * Subir sticker
   */
  static async uploadSticker(req, res) {
    try {
      const { title, category, tags = [] } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ 
          error: { code: 'NO_FILE', message: 'Archivo requerido' } 
        });
      }

      // Validar archivo
      const validation = await validateFile(file, TEMPLATE_SPECS.stickers);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: { code: 'INVALID_FILE', message: validation.error } 
        });
      }

      // Obtener dimensiones
      const metadata = await sharp(file.buffer).metadata();

      // Subir a almacenamiento
      const uploadPath = `templates/stickers/${Date.now()}-${file.originalname}`;
      const { url } = await uploadToStorage(file.buffer, uploadPath, file.mimetype);

      // Guardar en BD
      const template = await Template.create({
        type: 'STICKER',
        title,
        category,
        url,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        fileSize: file.size,
        tags: tags.join(','),
        specs: TEMPLATE_SPECS.stickers,
        uploadedBy: req.user.id
      });

      res.status(201).json({
        message: 'Sticker subido exitosamente',
        data: template
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'UPLOAD_ERROR', message: error.message } });
    }
  }

  /**
   * Actualizar sticker
   */
  static async updateSticker(req, res) {
    try {
      const { id } = req.params;
      const { title, category, tags, isActive } = req.body;

      const template = await Template.findByPk(id);

      if (!template) {
        return res.status(404).json({ 
          error: { code: 'TEMPLATE_NOT_FOUND', message: 'Plantilla no encontrada' } 
        });
      }

      await template.update({
        title,
        category,
        tags: tags?.join(','),
        isActive
      });

      res.json({
        message: 'Sticker actualizado',
        data: template
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  /**
   * Eliminar sticker
   */
  static async deleteSticker(req, res) {
    try {
      const { id } = req.params;

      const template = await Template.findByPk(id);

      if (!template) {
        return res.status(404).json({ 
          error: { code: 'TEMPLATE_NOT_FOUND', message: 'Plantilla no encontrada' } 
        });
      }

      await template.destroy();

      res.json({ message: 'Sticker eliminado' });
    } catch (error) {
      res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }
}

export default TemplateController;
