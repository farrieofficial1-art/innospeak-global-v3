BEGIN;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.academy_enrollments FROM anon, authenticated;

DROP POLICY IF EXISTS "insert_own_enrollments" ON public.academy_enrollments;
DROP POLICY IF EXISTS "update_own_enrollments" ON public.academy_enrollments;
DROP POLICY IF EXISTS "delete_own_enrollments" ON public.academy_enrollments;

DROP POLICY IF EXISTS "staff_manage_academy_enrollments" ON public.academy_enrollments;
CREATE POLICY "staff_manage_academy_enrollments"
ON public.academy_enrollments FOR ALL TO authenticated
USING (public.is_lms_admin())
WITH CHECK (public.is_lms_admin());

COMMIT;
