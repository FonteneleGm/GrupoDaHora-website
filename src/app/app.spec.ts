import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the welcome message', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#welcome')?.textContent).toContain('Grupo da Hora');
  });

  it('should register a presence without requiring age', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app['novoNome'] = 'Maria da Silva';
    app['registrarPresenca']();

    expect(app['registros']).toHaveLength(1);
    expect(app['registros'][0].nome).toBe('Maria da Silva');
    expect(app['registros'][0].idade).toBeUndefined();
    expect(app['registros'][0].presencaConfirmada).toBe(true);
  });
});
