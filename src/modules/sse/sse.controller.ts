import { InjectQueue } from '@nestjs/bull'
import { Controller, Get, Req, Res } from '@nestjs/common'
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { Queue } from 'bull'
import { Request, Response } from 'express'

import { SkipAuth } from '@/decorators'

import { SseService } from './sse.service'

@ApiTags('SSE')
@ApiBasicAuth('bearer')
@SkipThrottle()
@SkipAuth()
@Controller('sse')
export class SseController {
  constructor(
    private readonly sseService: SseService,
    @InjectQueue('notification') private notificationQueue: Queue
  ) {}

  @Get('notification')
  sendNotification(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const { userId } = req.query

    const listener = (type: string, data: any) => {
      res.write(`event: ${type}\n`)
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    }
    if (!userId) {
      res.json({ code: 400, message: 'userId is required' })
      return
    }

    res.write('data: abcd\n\n')

    this.notificationQueue.on('completed', (job) => {
      console.log(job.data.userId, userId)
      console.log(typeof job.data.userId, typeof userId)
      console.log(job.data.userId === userId)
      if (job.data.userId === parseInt(userId as string, 10)) {
        console.log(job.data)
        const { type, ...others } = job.data
        listener(type, others)
        job.remove()
      }
    })

    res.on('close', () => {
      this.notificationQueue.off('completed', listener)
    })
  }
}
