import { Controller, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.notificationService.getUserNotifications(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(id, req.user.sub);
  }

  @Patch('read-all')
  async markAll(@Req() req: any) {
    return this.notificationService.markAllAsRead(req.user.sub);
  }
}
