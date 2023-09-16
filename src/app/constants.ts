export const ENVIRONMENTS = ['development', 'test', 'production'] as const;

export const APP_HEADER_HEIGHT = 60;

export const LOGIN_HEADER_HEIGHT = 60;

export const PAGE_HEADER_HEIGHT = 50;

export const DRAWER_WIDTH = 200;

export const DRAWER_MINIMIZED_WIDTH = 70;

export const PAGINATION_SIZES = [10, 20, 50, 100] as const;

export const DEFAULT_PAGINATION_SIZE =
	10 satisfies (typeof PAGINATION_SIZES)[number];

export const USER_TYPES = ['Administrator', 'Supervisor', 'Worker'] as const;

export const SIDEBAR_GROUPS = [
	'order-generation',
	'cutting',
	'stitching',
	'machine',
	'smart-box-allocation',
	'quality',
	'planning',
	'bottom',
] as const;

export const SIDEBAR_GROUPS_LABELS: Partial<
	Record<(typeof SIDEBAR_GROUPS)[number], string>
> = {
	bottom: 'Settings',
};

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
