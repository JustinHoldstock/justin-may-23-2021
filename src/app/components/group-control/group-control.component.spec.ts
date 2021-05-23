import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupControlComponent } from './group-control.component';

describe('GroupControlComponent', () => {
  let component: GroupControlComponent;
  let fixture: ComponentFixture<GroupControlComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should make sure to trigger a UI update for the current group value', () => {
      component.ngOnInit();

      expect(component.groupIndex).toEqual(0);
    });
  });

  describe('groupUpdated()', () => {
    it('should update to the next group when positive direction', () => {
      component.groupUpdated(3);
      expect(component.groupIndex).toEqual(3);
    });

    it('should update to the previous group when negactive direction', () => {
      component.groupUpdated(2);
      component.groupUpdated(-1);
      expect(component.groupIndex).toEqual(1);
    });

    it('should clamp updates to first and last items', () => {
      component.groupUpdated(100);
      expect(component.groupIndex).toEqual(10);
      component.groupUpdated(-2000);
      expect(component.groupIndex).toEqual(0);
    });

    it('should emit the current price group after an update', () => {
      const spy = spyOn(component.groupChanged, 'emit');
      component.groupUpdated(0);

      expect(spy).toHaveBeenCalledWith(0.5);
    });

    it('should update display with a formatted price value', () => {
      component.groupUpdated(0);

      expect(component.groupVal).toEqual('0.50');
    });
  });
});
