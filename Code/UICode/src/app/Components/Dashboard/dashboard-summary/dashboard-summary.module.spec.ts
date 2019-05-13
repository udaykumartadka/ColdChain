import { DashboardSummaryModule } from './dashboard-summary.module';

describe('DashboardSummaryModule', () => {
  let dashboardSummaryModule: DashboardSummaryModule;

  beforeEach(() => {
    dashboardSummaryModule = new DashboardSummaryModule();
  });

  it('should create an instance', () => {
    expect(dashboardSummaryModule).toBeTruthy();
  });
});
