
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { mockUserData } from './user.mock.spec.data';
import { ConfigService, ToasterService, SharedModule} from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LearnerService, UserService, PermissionService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('userService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [UserService, ConfigService, LearnerService]
    });
  });
  it('should fetch user profile details', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile).toBeDefined();
  }));
  it('should emit user profile data on success', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.userProfile).toBeDefined();
    });
  }));
  it('should emit error on api failure', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableThrowError(mockUserData.error));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.err).toBeDefined();
    });
  }));
  it('should return userProfile when userProfile get method is called', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    const userProfile = userService.userProfile;
    expect(userProfile).toBeDefined();
  }));
  it('should set rootOrgAdmin to true', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.rootOrgSuccess));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeTruthy();
  }));
  it('should set rootOrgAdmin to false', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeFalsy();
  }));
});
