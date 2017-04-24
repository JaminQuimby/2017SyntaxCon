import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { expect, SkyAppTestModule } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { OfflineModeComponent } from './offlinemode.component';
import { By } from '@angular/platform-browser';

fdescribe('My Component', () => {
  let fixture: ComponentFixture<OfflineModeComponent>;

  beforeEach(() => {
    console.log('1. beforeEach setting up module');
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SkyAppTestModule]
    });

  });
  beforeEach(() => {
    console.log('2. components compiled');
    fixture = TestBed.createComponent(OfflineModeComponent);
    //  spyOn(console, 'log').and.stub();
  });

  it('should work ', fakeAsync(() => {
    console.log('3. test it');
    fixture.detectChanges();

    console.log('4. test stable');
    tick();
    expect(0).toEqual(0);


  }));

});
