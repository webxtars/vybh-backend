import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto, RefreshDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Login user',
		description: 'Login to the application',
	})
	@Post('login')
	@UseGuards(LocalGuard)
	async (@Body() data: AuthDto, @Req() req: any) {
		return req.user;
	}

	@Post('refresh')
    @ApiOperation({ summary: 'Refresh Access token' })
    @UseGuards(AuthGuard('refresh'))
    async refresh(@Body() refreshDto: RefreshDto) {
        return this.authService.refresh(refreshDto.refreshToken);
    }
}
